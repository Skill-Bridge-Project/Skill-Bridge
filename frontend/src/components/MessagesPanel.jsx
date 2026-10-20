
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  MessageCircle,
  Plus,
  Search,
  Send,
  UserRound,
  X,
  Pencil,
  Trash2,
  LoaderCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import { companyOf, timeAgo } from '../lib/utils';

const errMsg = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  'Something went wrong. Please try again.';

export default function MessagesPanel({
  compact = false,
  initialTo = null,
}) {
  const { user } = useAuth();

  const [convos, setConvos] = useState([]);
  const [active, setActive] = useState(initialTo);
  const [thread, setThread] = useState({
    user: null,
    messages: [],
  });

  const [text, setText] = useState('');
  const [people, setPeople] = useState([]);
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState('');
  const [loadingPeople, setLoadingPeople] = useState(false);
  const [sending, setSending] = useState(false);

  // Edit message state
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const end = useRef(null);
  const inputRef = useRef(null);

  const currentUserId = user?._id || user?.id;

  // Load conversations
  const loadConvos = useCallback(async () => {
    try {
      const response = await api.get('/messages');

      setConvos(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.error(
        'Failed to load conversations:',
        error.response?.data || error
      );
    }
  }, []);

  // Load messages for the selected conversation
  const loadThread = useCallback(async () => {
    if (!active) {
      setThread({ user: null, messages: [] });
      return;
    }

    try {
      const response = await api.get(`/messages/${active}`);

      setThread({
        user: response.data?.user || null,
        messages: Array.isArray(response.data?.messages)
          ? response.data.messages
          : [],
      });
    } catch (error) {
      console.error(
        'Failed to load messages:',
        error.response?.data || error
      );
      toast.error(errMsg(error));
    }
  }, [active]);

  // Refresh conversation list
  useEffect(() => {
    loadConvos();

    const timer = setInterval(loadConvos, 10000);

    return () => clearInterval(timer);
  }, [loadConvos]);

  // Open the initially requested conversation
  useEffect(() => {
    if (initialTo) {
      setActive(initialTo);
    }
  }, [initialTo]);

  // Refresh selected conversation
  useEffect(() => {
    loadThread();

    if (!active) return undefined;

    const timer = setInterval(loadThread, 6000);

    return () => clearInterval(timer);
  }, [active, loadThread]);

  // Scroll to the latest message
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread.messages.length, active]);

  // Start a new conversation
  const startNew = async () => {
    setAdding(true);
    setLoadingPeople(true);

    try {
      const role =
        user?.role === 'student' ? 'employer' : 'student';

      const response = await api.get('/users', {
        params: { role },
      });

      setPeople(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      toast.error(errMsg(error));
    } finally {
      setLoadingPeople(false);
    }
  };

  // Begin editing a message
  const startEdit = (message) => {
    if (!message?._id) {
      toast.error('Message ID is missing.');
      return;
    }

    setEditingId(message._id);
    setEditText(message.text || '');
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  // Save an edited message
  const saveEdit = async (messageId) => {
    const updatedText = editText.trim();

    if (!updatedText) {
      toast.error('Message cannot be empty.');
      return;
    }

    if (savingEdit) return;

    const originalMessage = thread.messages.find(
      (message) => String(message._id) === String(messageId)
    );

    if (updatedText === originalMessage?.text) {
      cancelEdit();
      return;
    }

    setSavingEdit(true);

    try {
      await api.put(`/messages/${messageId}`, {
        text: updatedText,
      });

      toast.success('Message updated successfully.');

      cancelEdit();

      await Promise.all([loadThread(), loadConvos()]);
    } catch (error) {
      console.error(
        'Failed to edit message:',
        error.response?.data || error
      );

      toast.error(errMsg(error));
    } finally {
      setSavingEdit(false);
    }
  };

  // Delete a message
  const deleteMessage = async (messageId) => {
    if (!messageId || deletingId) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this message?'
    );

    if (!confirmed) return;

    setDeletingId(messageId);

    try {
      await api.delete(`/messages/${messageId}`);

      if (String(editingId) === String(messageId)) {
        cancelEdit();
      }

      toast.success('Message deleted successfully.');

      await Promise.all([loadThread(), loadConvos()]);
    } catch (error) {
      console.error(
        'Failed to delete message:',
        error.response?.data || error
      );

      toast.error(errMsg(error));
    } finally {
      setDeletingId(null);
    }
  };

  // Send a new message
  const send = async (event) => {
    event.preventDefault();

    const message = text.trim();

    if (!message || !active || sending) return;

    setSending(true);

    try {
      await api.post('/messages', {
        to: active,
        text: message,
      });

      setText('');

      await Promise.all([loadThread(), loadConvos()]);

      inputRef.current?.focus();
    } catch (error) {
      console.error(
        'Failed to send message:',
        error.response?.data || error
      );

      toast.error(errMsg(error));
    } finally {
      setSending(false);
    }
  };

  // Search conversations
  const filteredConvos = convos.filter((conversation) => {
    const name = companyOf(conversation.user) || '';
    const lastMessage = conversation.last || '';

    return `${name} ${lastMessage}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const personName = (person) =>
    companyOf(person) || person?.name || 'User';

  const initials = (person) =>
    personName(person)
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();

  const avatar = (person, size = 'h-11 w-11') => (
    <div
      className={`${size} flex shrink-0 items-center justify-center rounded-full border border-blue-100 bg-blue-50 font-semibold text-blue-700`}
    >
      {person ? (
        initials(person)
      ) : (
        <UserRound size={19} />
      )}
    </div>
  );

  // Conversation list
  const list = (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <div className="border-b border-slate-100 p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Messages
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Your conversations
            </p>
          </div>

          <button
            type="button"
            onClick={startNew}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700 transition hover:bg-blue-100"
            aria-label="Start a new conversation"
            title="New conversation"
          >
            <Plus size={20} />
          </button>
        </div>

        <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-50">
          <Search
            size={17}
            className="shrink-0 text-slate-400"
          />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search conversations"
            className="w-full min-w-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </label>
      </div>

      {adding && (
        <div className="border-b border-blue-100 bg-blue-50/60 p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">
              New conversation
            </p>

            <button
              type="button"
              onClick={() => setAdding(false)}
              className="rounded-lg p-1 text-slate-500 hover:bg-white"
              aria-label="Close new conversation"
            >
              <X size={16} />
            </button>
          </div>

          {loadingPeople ? (
            <p className="p-3 text-sm text-slate-500">
              Loading people...
            </p>
          ) : (
            <select
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 outline-none focus:border-blue-400"
              value=""
              onChange={(event) => {
                if (event.target.value) {
                  setActive(event.target.value);
                  setAdding(false);
                }
              }}
            >
              <option value="" disabled>
                Select{' '}
                {user?.role === 'student'
                  ? 'an employer'
                  : 'a student'}
              </option>

              {people
                .filter(
                  (person) =>
                    String(person._id) !== String(currentUserId)
                )
                .map((person) => (
                  <option key={person._id} value={person._id}>
                    {personName(person)}
                  </option>
                ))}
            </select>
          )}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {filteredConvos.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <MessageCircle size={23} />
            </div>

            <p className="text-sm font-semibold text-slate-700">
              {search
                ? 'No matching conversations'
                : 'No conversations yet'}
            </p>

            <p className="mx-auto mt-1 max-w-52 text-xs leading-5 text-slate-500">
              {search
                ? 'Try searching with a different name or message.'
                : 'Start a conversation to connect with students and employers.'}
            </p>
          </div>
        ) : (
          filteredConvos.map((conversation) => {
            const person = conversation.user;
            const isSelected =
              String(active) === String(person?._id);

            return (
              <button
                key={person?._id}
                type="button"
                onClick={() => setActive(person?._id)}
                className={`flex w-full items-center gap-3 border-b border-slate-100/80 px-4 py-4 text-left transition ${
                  isSelected
                    ? 'bg-blue-50/80'
                    : 'hover:bg-slate-50'
                }`}
              >
                {avatar(person)}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {personName(person)}
                    </p>

                    {conversation.at && (
                      <span className="shrink-0 text-[10px] text-slate-400">
                        {timeAgo(conversation.at)}
                      </span>
                    )}
                  </div>

                  <p className="mt-1 truncate text-xs text-slate-500">
                    {conversation.last || 'Start chatting'}
                  </p>
                </div>

                {conversation.unread > 0 && (
                  <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white">
                    {conversation.unread > 99
                      ? '99+'
                      : conversation.unread}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );

  // Chat window
  const chat = (
    <div className="flex h-full min-h-0 min-w-0 flex-col bg-[#f8faff]">
      <header className="flex items-center gap-3 border-b border-slate-100 bg-white px-4 py-3.5 sm:px-5">
        {compact && (
          <button
            type="button"
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100"
            onClick={() => setActive(null)}
            aria-label="Back to conversations"
          >
            <ArrowLeft size={19} />
          </button>
        )}

        {avatar(thread.user, 'h-10 w-10')}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-slate-900">
            {thread.user
              ? personName(thread.user)
              : 'Conversation'}
          </p>

          <p className="mt-0.5 text-xs capitalize text-slate-500">
            {thread.user?.role || 'SkillBridge chat'}
          </p>
        </div>

        <div className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-medium text-emerald-700">
            Chat
          </span>
        </div>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
        {thread.messages.length === 0 ? (
          <div className="flex h-full min-h-52 flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border border-blue-100 bg-white text-blue-600 shadow-sm">
              <MessageCircle size={29} />
            </div>

            <p className="text-sm font-semibold text-slate-700">
              Start your conversation
            </p>

            <p className="mt-1 max-w-64 text-xs leading-5 text-slate-500">
              Send a message to connect with{' '}
              {thread.user
                ? personName(thread.user)
                : 'this person'}
              .
            </p>
          </div>
        ) : (
          thread.messages.map((message) => {
            const senderId =
              message.sender?._id || message.sender;

            const mine =
              String(senderId) === String(currentUserId);

            const isEditing =
              String(editingId) === String(message._id);

            const isDeleting =
              String(deletingId) === String(message._id);

            return (
              <div
                key={message._id}
                className={`flex ${
                  mine ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 shadow-sm sm:max-w-[75%] ${
                    mine
                      ? 'rounded-br-md bg-blue-600 text-white'
                      : 'rounded-bl-md border border-slate-100 bg-white text-slate-800'
                  }`}
                >
                  {isEditing ? (
                    <div className="min-w-52 space-y-2">
                      <textarea
                        value={editText}
                        onChange={(event) =>
                          setEditText(event.target.value)
                        }
                        onKeyDown={(event) => {
                          if (
                            event.key === 'Enter' &&
                            !event.shiftKey
                          ) {
                            event.preventDefault();
                            saveEdit(message._id);
                          }

                          if (event.key === 'Escape') {
                            cancelEdit();
                          }
                        }}
                        rows={3}
                        maxLength={5000}
                        aria-label="Edit message"
                        autoFocus
                        className="w-full resize-y rounded-lg border border-blue-200 bg-white p-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-300"
                      />

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={cancelEdit}
                          disabled={savingEdit}
                          className="rounded-lg bg-white/15 px-3 py-1.5 text-xs font-medium hover:bg-white/25 disabled:opacity-50"
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          onClick={() => saveEdit(message._id)}
                          disabled={
                            !editText.trim() || savingEdit
                          }
                          className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                        >
                          {savingEdit && (
                            <LoaderCircle
                              size={13}
                              className="animate-spin"
                            />
                          )}

                          {savingEdit ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap break-words text-sm leading-6">
                      {message.text}
                    </p>
                  )}

                  <div
                    className={`mt-2 flex flex-wrap items-center justify-end gap-2 text-[10px] ${
                      mine ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    <span>
                      {timeAgo(
                        message.updatedAt || message.createdAt
                      )}
                    </span>

                    {mine && <Check size={12} />}

                    {mine && !isEditing && (
                      <>
                        <button
                          type="button"
                          onClick={() => startEdit(message)}
                          disabled={Boolean(deletingId)}
                          className="inline-flex items-center justify-center rounded-md p-1 transition hover:bg-white/20 disabled:opacity-50"
                          title="Edit message"
                          aria-label="Edit message"
                        >
                          <Pencil size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteMessage(message._id)
                          }
                          disabled={Boolean(deletingId)}
                          className="inline-flex items-center justify-center rounded-md p-1 text-red-100 transition hover:bg-white/20 disabled:opacity-50"
                          title="Delete message"
                          aria-label="Delete message"
                        >
                          {isDeleting ? (
                            <LoaderCircle
                              size={14}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        <div ref={end} />
      </div>

      <form
        onSubmit={send}
        className="border-t border-slate-100 bg-white p-3 sm:px-5 sm:py-4"
      >
        <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 focus-within:border-blue-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-50">
          <textarea
            ref={inputRef}
            rows={1}
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === 'Enter' &&
                !event.shiftKey
              ) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            placeholder="Type a message..."
            aria-label="Type a message"
            className="max-h-28 min-h-10 flex-1 resize-y bg-transparent px-2 py-2 text-sm leading-5 text-slate-700 outline-none placeholder:text-slate-400"
          />

          <button
            type="submit"
            disabled={!text.trim() || !active || sending}
            aria-label="Send message"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            {sending ? (
              <LoaderCircle
                size={17}
                className="animate-spin"
              />
            ) : (
              <Send size={17} />
            )}
          </button>
        </div>

        <p className="mt-2 px-1 text-[10px] text-slate-400">
          Press Enter to send · Shift + Enter for a new line
        </p>
      </form>
    </div>
  );

  // Compact layout
  if (compact) {
    return (
      <div className="h-full min-h-[30rem] overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {active ? chat : list}
      </div>
    );
  }

  // Full messages layout
  return (
    <div className="grid h-[min(76vh,720px)] min-h-[520px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:grid-cols-[300px_minmax(0,1fr)] lg:grid-cols-[340px_minmax(0,1fr)]">
      <aside
        className={`${
          active ? 'hidden md:flex' : 'flex'
        } min-h-0 flex-col border-r border-slate-100`}
      >
        {list}
      </aside>

      <section
        className={`${
          active ? 'flex' : 'hidden md:flex'
        } min-h-0 min-w-0 flex-col`}
      >
        {active ? (
          chat
        ) : (
          <div className="flex h-full flex-col items-center justify-center bg-[#f8faff] px-6 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-blue-100 bg-white text-blue-600 shadow-sm">
              <MessageCircle size={34} />
            </div>

            <h3 className="text-lg font-bold text-slate-800">
              Your messages
            </h3>

            <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
              Select a conversation or start a new one to connect
              with people on SkillBridge.
            </p>

            <button
              type="button"
              onClick={startNew}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Plus size={17} />
              New conversation
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

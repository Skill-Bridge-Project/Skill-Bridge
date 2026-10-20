import { useSearchParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import MessagesPanel from '../components/MessagesPanel';

export default function Messages() {
  const [params] = useSearchParams();
  return (
    <>
      <PageHeader title="Messages"  />
      <MessagesPanel initialTo={params.get('to')} />
    </>
  );
}

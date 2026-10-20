const Sec = ({ title, children }) => (
  <section className="mt-5">
    <h3 className="border-b border-base-300 pb-1 text-sm font-semibold text-primary">{title}</h3>
    <div className="mt-2 space-y-2 text-sm">{children}</div>
  </section>
);

export default function ResumePreview({ data = {} }) {
  const d = data;
  const contact = [d.email, d.phone, d.location].filter(Boolean).join('  |  ');
  return (
    <div className="print-area panel p-8 text-sm leading-relaxed">
      <h2 className="text-2xl font-semibold">{d.fullName || 'Your name'}</h2>
      {contact && <p className="muted">{contact}</p>}
      {d.summary && <Sec title="Summary"><p>{d.summary}</p></Sec>}
      {d.education?.some((e) => e.school) && (
        <Sec title="Education">
          {d.education.filter((e) => e.school).map((e, i) => (
            <div key={i} className="flex justify-between gap-3"><span><b>{e.school}</b>{e.degree && ` — ${e.degree}`}</span><span className="muted">{e.year}</span></div>
          ))}
        </Sec>
      )}
      {d.experience?.some((e) => e.role) && (
        <Sec title="Experience">
          {d.experience.filter((e) => e.role).map((e, i) => (
            <div key={i}>
              <div className="flex justify-between gap-3"><span><b>{e.role}</b>{e.company && `, ${e.company}`}</span><span className="muted">{e.duration}</span></div>
              {e.description && <p className="muted">{e.description}</p>}
            </div>
          ))}
        </Sec>
      )}
      {d.projects?.some((p) => p.name) && (
        <Sec title="Projects">
          {d.projects.filter((p) => p.name).map((p, i) => <div key={i}><b>{p.name}</b>{p.description && <p className="muted">{p.description}</p>}</div>)}
        </Sec>
      )}
      {d.skills?.length > 0 && <Sec title="Skills"><p>{d.skills.join(', ')}</p></Sec>}
      {d.certifications?.length > 0 && <Sec title="Certifications"><ul className="list-disc pl-5">{d.certifications.map((c, i) => <li key={i}>{c}</li>)}</ul></Sec>}
    </div>
  );
}

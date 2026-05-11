const EmptyState = ({ title, description }) => (
  <div className="glass rounded-2xl p-8 text-center">
    <p className="text-xl font-semibold">{title}</p>
    <p className="mt-2 text-slate-400">{description}</p>
  </div>
);

export default EmptyState;

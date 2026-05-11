const Loader = ({ text = "Loading..." }) => (
  <div className="flex items-center justify-center py-12">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
    <span className="ml-3 text-slate-300">{text}</span>
  </div>
);

export default Loader;

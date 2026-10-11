export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div
        className="absolute -top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full opacity-60 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(249,115,22,0.28) 0%, rgba(239,68,68,0.14) 40%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[700px] h-[700px] rounded-full opacity-50 blur-[140px]"
        style={{
          background: "radial-gradient(circle, rgba(34,211,238,0.18) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
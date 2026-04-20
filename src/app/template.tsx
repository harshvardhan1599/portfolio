export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ animation: "blur-in 300ms ease-out" }}>
      {children}
    </div>
  );
}

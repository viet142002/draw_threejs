interface MainLayoutProps {
  children: React.ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <div>
      {/* <LeftControl /> */}
      {children}
    </div>
  );
}

export default MainLayout;

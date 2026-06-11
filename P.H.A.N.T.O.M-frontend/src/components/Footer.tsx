const Footer = () => {
  return (
    <footer className="bg-bg-card border-t border-border-light py-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <div>
            © {new Date().getFullYear()} P.H.A.N.T.O.M
          </div>
          <div className="flex items-center space-x-2">
            <span>v1.0.0</span>
            <span>•</span>
            <span>Beta</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
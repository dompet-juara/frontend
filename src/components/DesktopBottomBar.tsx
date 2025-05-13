function DesktopBottomBar() {
    const year = new Date().getFullYear();
  
    return (
      <div className="text-center text-muted py-3 text-xl text-primary">
        Dompet Juara © {year}
      </div>
    );
  }
  
  export default DesktopBottomBar;
  
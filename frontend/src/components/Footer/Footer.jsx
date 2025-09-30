import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <span>© Developed by TripleTen Students</span>
      <span>{new Date().getFullYear()}</span>
    </footer>
  );
};

export default Footer;

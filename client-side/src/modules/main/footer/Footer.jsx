import { DateTime } from "luxon";
import packageJSON from "../../../../package.json";

const Footer = () => {
  return (
    <footer className="main-footer">
      <strong>
        <span>Copyright © {DateTime.now().toFormat("y")} </span>
        <a
          href="https://travello.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          tech-taqwa.com
        </a>
      </strong>
      <div className="float-right d-none d-sm-inline-block">
        <b>Version</b>
        <span>&nbsp;{packageJSON.version}</span>
      </div>
    </footer>
  );
};

export default Footer;

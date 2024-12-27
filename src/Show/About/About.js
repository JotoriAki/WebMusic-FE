import classNames from "classnames/bind";

import styles from "./About.module.scss";
const cx = classNames.bind(styles);

function About() {
  return <div className={cx("About")}>About</div>;
}

export default About;

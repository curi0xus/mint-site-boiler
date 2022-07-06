import App from "next/app";
import { Grommet, grommet as grommetTheme } from "grommet";
import "styles.css";

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Grommet theme={grommetTheme}>
        <Component {...pageProps} />
      </Grommet>
    );
  }
}

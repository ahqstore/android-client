class Overrides {
  backPress = () => false
  installCode: typeof window.installCode = () => undefined

  constructor() {
    this.reRegister();
  }

  reRegister() {
    window.backCall = this.backPress;
    window.installCode = this.installCode
  }

  overrideBack(fn: () => boolean) {
    this.backPress = fn;
    this.reRegister();
  }

  overrideInstall(fn: () => undefined) {
    this.installCode = fn;
    this.reRegister();
  }

  resetBack() {
    this.overrideBack(() => false);
  }

  resetInstall() {
    this.overrideInstall(() => undefined);
  }
}

const override = new Overrides();

export { override };
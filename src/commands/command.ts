export default abstract class Command {
  protected event: any;

  public constructor(event: any) {
    this.event = event
  }

  protected abstract async doProcess(): Promise<void>;

  protected abstract async canProcess(): Promise<boolean>;

  public async process(): Promise<void> {
    const canProcess = await this.canProcess();
    if (canProcess) {
      console.log(`Running command: ${this.constructor.name}`);
      this.doProcess();
    }
  }
}

import logger from '../logger';

export default abstract class Command {
  protected event: any;

  public constructor(event: any) {
    this.event = event
  }

  public abstract async doProcess(): Promise<void>;

  protected abstract async canProcess(): Promise<boolean>;

  public async process(): Promise<void> {
    const canProcess = await this.canProcess();
    if (canProcess) {
      logger.info(`Running command: ${this.constructor.name}`);
      this.doProcess();
    }
  }
}

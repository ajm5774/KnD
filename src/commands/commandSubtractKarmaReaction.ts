import CommandAddKarmaReaction from './commandAddKarmaReaction';
import CommandSubtractKarmaMessage from './commandSubtractKarmaMessage';

export default class CommandSubtractKarmaReaction extends CommandAddKarmaReaction {
  protected allowedReactions: string[] = ['-1'];

  public async doProcess(): Promise<void> {
    // hack: switch to a mixin at some point
    return new CommandSubtractKarmaMessage({}).doProcess.apply(this);
  }
}

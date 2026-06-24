import { rootStackName } from './rootStackName';

export type rootStackParams = {
  [rootStackName.AUTH]: undefined;
  [rootStackName.MAIN]: undefined;
  [rootStackName.COMMUNITY_DETAILS]: { communityId: string };
};

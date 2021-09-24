const trolls = {
  'troll-developer': {},
  'troll-manager': {}
}
export default trolls;
export type Troll = `${keyof typeof trolls}`;


interface IPost {
  id: string;
  communityId: string;
  authorId: string;
  title: string;
  body: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
}

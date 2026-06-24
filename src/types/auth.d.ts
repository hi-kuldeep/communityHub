interface IUser {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
  avatar?: string;
  location?: string;
  token?: string;
}

interface IAuthState {
  token: string | null;
  isAuthenticated: boolean;
  isRestoring: boolean;
  user: IUser | null;
  expiresAt: number | null;
  login: (payload: {
    token: string;
    expiresAt: number;
    user: IUser;
  }) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  updateUser: (user: Partial<IUser>) => Promise<void>;
}

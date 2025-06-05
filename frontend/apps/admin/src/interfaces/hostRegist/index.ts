import { HostRegistState, User } from "interfaces/user";

export interface HostRegist {
  id: number;
  user: User;
  state: HostRegistState;
  created_at: string;
  updated_at: string;
}

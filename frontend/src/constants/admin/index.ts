export enum AdminPathnames {
  Host = "/admin/host",
  Landing = "/admin/landing",
  Submission = "/admin/submission",
  SignUp = "/admin/signup",
}

export enum Pathnames {
  //consumer
  Home = "/",
  ChannelDetail = "/detail",
  Login = "/login",
  SignUp = "/signup",
  Profile = "/profile",
  EditProfile = "/profile/edit",

  // Admin
  AdminLogin = "/admin/login",
  AdminHome = "/admin",
  Social = "/admin/social",

  CreateSocial = "/admin/social/create",

  // 유저
  User = "/admin/user",
  CreateUser = "/admin/user/create",

  // (구)소셜링
  Channel = "/admin/channel",
  CreateChannel = "/admin/channel/create",
  EditChannel = "/admin/channel/edit",

  // 브랜드
  Brand = "/admin/brand",
  CreateBrand = "/admin/brand/create",
  EditBrand = "/admin/brand/edit",

  // 🔗 플러그인 🔗

  // 랜딩 소개 페이지
  Landing = "/landing",
  // 상품 상세 페이지
  LandingProduct = "/landing/product",
  // 설문폼 페이지
  RegistForm = "/landing/product/form",
  // 설문폼 제출 완료 페이지
  SubmissionComplete = "/landing/product/form/result",

  // 기타
  Mbti = "/mbti",
  Habit = "/habit",
}

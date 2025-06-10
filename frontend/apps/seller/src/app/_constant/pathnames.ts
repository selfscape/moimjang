const pathnames = {
  home: "/",
  brand: "/brand",
  registForm: "/form",
  registComplete: (brandId: string | string[] | undefined) =>
    `/form/${brandId}/complete`,
};

export default pathnames;

export function convertFileToBase64(file: File): Promise<string> {
  if (!file?.type) return null;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = function () {
      resolve(reader.result as string);
    };

    reader.onerror = function (error) {
      reject(error);
    };
  });
}

export function isBase64Url(url: string) {
  try {
    window.atob(url.split(",")[1]);

    return true;
  } catch {
    return false;
  }
}

import { atom, atomFamily } from "recoil";

export const PatientAtom = atom({
  key: "paitentStateAtom", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});

export const IsLoadingAtom = atom({
  key: "IsLoadingAtom",
  default: null,
});

export const ImageAtom = atom({
  key: "imageStateAtom", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
export const ImageHistoryAtom = atom({
  key: "imageHistoryStateAtom", // unique ID (with respect to other atoms/selectors)
  default: null, // default value (aka initial value)
});

export const ImageCompareAtom = atom({
  key: "imageCompareStateAtom", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});

export const ImageSessionAtom = atom({
  key: "sessionImageStateAtom", // unique ID (with respect to other atoms/selectors)
  default: getUserObject(), // default value (aka initial value)
});

export function getUserObject(data) {
  return {
    id: data?.id || 0,
    patientId: data?.patientId || null,
    imageData:
      data?.imageData ||
      Array(4)
        .fill(null)
        .map(() => getImageDataObject()),
    isActive: data?.isActive || "",
    createdBy: data?.createdBy || "Anupam",
    updatedBy: data?.updatedBy || "Anupam",
    createdAt: data?.createdAt || null,
    updatedAt: data?.updatedAt || null,
  };
}

export function getImageDataObject(data) {
  return {
    id: data?.id || null,
    title: data?.title || "",
    description: data?.description || "",
    imageUrl: data?.imageUrl || "",
  };
}

export const UserDetailsAtom = atom({
  key: "UserDetaisAtom",
  default: getRegisterObject(),
});

export function getRegisterObject(data) {
  return {
    userId: data?.userId || null,
    email: data?.email || "",
    firstName: data?.firstName || "",
    lastName: data?.lastName || "",
    gender: data?.gender || null,
    date: data?.date || null,
    phone: data?.phone || null,
  };
}

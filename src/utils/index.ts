import { NewBallot } from '../components/CreationModal';

export const truncateText = (text: string) => {
  if (text.length > 20) {
    return text.slice(0, 20) + '...';
  } else {
    return text;
  }
};

export const isObjectComplete = (object: NewBallot) => {
  const keys = Object.keys(object);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i] as keyof NewBallot;
    if (object[key] === '') {
      return false;
    }
    if (Array.isArray(object[key])) {
      if (object[key].some((element: string) => element === '')) {
        return false;
      }
    }
  }
  return true;
};

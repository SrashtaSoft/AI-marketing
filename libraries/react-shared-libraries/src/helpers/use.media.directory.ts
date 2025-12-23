import { useCallback } from 'react';
import { useVariables } from '@gitroom/react/helpers/variable.context';

export const useMediaDirectory = () => {
  const { storageProvider, backendUrl } = useVariables();

  const set = useCallback((path: string) => {
    if (storageProvider === 'local' && path.startsWith('http')) {
      return path;
    }
    if (storageProvider === 'local' && !path.startsWith('http')) {
      return backendUrl + '/uploads' + path;
    }
    return path;
  }, [storageProvider, backendUrl]);
  return {
    set,
  };
};

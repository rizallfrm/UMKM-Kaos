
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function CsrfToken() {
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    const token = Cookies.get('XSRF-TOKEN') || '';
    setCsrfToken(token);
  }, []);

  return <input type="hidden" name="_csrf" value={csrfToken} />;
}
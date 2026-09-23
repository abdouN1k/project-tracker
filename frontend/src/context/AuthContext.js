// حط هادي فبلاصت دالة register القديمة:
  const register = async (userData) => {
    const { data } = await API.post('/auth/register', userData);
    // data contient { token, user }
    const userToStore = { ...data.user, token: data.token };
    setUser(userToStore);
    localStorage.setItem('user', JSON.stringify(userToStore));
    return userToStore;
  };

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    const userToStore = { ...data.user, token: data.token };
    setUser(userToStore);
    localStorage.setItem('user', JSON.stringify(userToStore));
    return userToStore;
  };
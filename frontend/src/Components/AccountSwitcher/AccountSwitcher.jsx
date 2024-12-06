import React, { useState, useEffect } from 'react';
import './AccountSwitcher.css'
const AccountSwitcher = () => {
  const [accounts, setAccounts] = useState([]);
  const [currentAccount, setCurrentAccount] = useState(null);

  useEffect(() => {
    // Lấy danh sách tài khoản từ localStorage
    const storedAccounts = JSON.parse(localStorage.getItem('accounts'));
    if (storedAccounts) {
      setAccounts(storedAccounts);
      // Thiết lập tài khoản hiện tại là tài khoản đầu tiên (hoặc lấy từ localStorage nếu cần)
      setCurrentAccount(storedAccounts[0]);
    }
  }, []);

  // Hàm để chuyển đổi tài khoản
  const switchAccount = (account) => {
    setCurrentAccount(account);
    // Lưu tài khoản hiện tại trong localStorage hoặc thực hiện các thao tác cần thiết
    localStorage.setItem('currentAccount', JSON.stringify(account));
    // Bạn có thể gọi API để refresh token hoặc làm các bước xác thực khác nếu cần
  };

  return (
    <div>
      <h3>Chuyển đổi tài khoản</h3>
      {accounts.length > 0 ? (
        <ul>
          {accounts.map((account, index) => (
            <li key={index} onClick={() => switchAccount(account)}>
              {account.username}
            </li>
          ))}
        </ul>
      ) : (
        <p>Không có tài khoản nào để chuyển đổi</p>
      )}

      {currentAccount && (
        <div>
          <h4>Tài khoản hiện tại: {currentAccount.username}</h4>
        </div>
      )}
    </div>
  );
};

export default AccountSwitcher;

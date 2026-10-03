import re

with open('src/lib/store.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add deleteAccount function to store.jsx
old_create = """  const createAccount = useCallback(account => {
    write(d => { d.accounts.push(account); vaultOf(d, account.email); });
  }, [write]);"""

new_create = """  const createAccount = useCallback(account => {
    write(d => { d.accounts.push(account); vaultOf(d, account.email); });
  }, [write]);

  const deleteAccount = useCallback(email => {
    write(d => {
      d.accounts = d.accounts.filter(a => a.email.toLowerCase() !== email.toLowerCase());
      delete d.vault[email.toLowerCase()];
      if (d.session?.email?.toLowerCase() === email.toLowerCase()) {
         d.session = null;
      }
    });
    toast("Account deleted", "🗑️");
  }, [write, toast]);"""

c = c.replace(old_create, new_create)

c = c.replace('createAccount, updateMe,', 'createAccount, deleteAccount, updateMe,')

with open('src/lib/store.jsx', 'w', encoding='utf-8') as f:
    f.write(c)


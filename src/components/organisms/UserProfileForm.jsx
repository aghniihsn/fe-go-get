import Input from "../atoms/Input";

const UserProfileForm = ({ user, onChange, onSubmit }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <Input label="Nama" name="nama" value={user.nama} onChange={onChange} />
    <Input label="Email" name="email" type="email" value={user.email} onChange={onChange} />
    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Simpan</button>
  </form>
);

export default UserProfileForm;

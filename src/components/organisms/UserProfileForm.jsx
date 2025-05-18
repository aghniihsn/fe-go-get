import Button from "../atoms/Button";
import Input from "../atoms/Input";

const UserProfileForm = ({ user, onChange, onSubmit }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <Input label="Nama" name="nama" value={user.nama} onChange={onChange} />
    <Input label="Email" name="email" type="email" value={user.email} onChange={onChange} />
    <Button type="submit" className="w-1/2">Simpan</Button>
  </form>
);

export default UserProfileForm;

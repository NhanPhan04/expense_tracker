import { useState } from 'react';

export default function AvatarUpload({ avatar, onChange }) {
  const [preview, setPreview] = useState(avatar || '');

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // giả lập upload: chuyển file thành base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      onChange(reader.result); // gửi lên parent
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center">
      <img
        src={preview || '/default-avatar.png'}
        alt="avatar"
        className="w-24 h-24 rounded-full"
      />
      <input type="file" accept="image/*" onChange={handleFile} className="mt-2" />
    </div>
  );
}

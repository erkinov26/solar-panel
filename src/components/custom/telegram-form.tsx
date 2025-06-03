import { useState } from 'react';
import { Button } from '../ui/moving-border';

const TelegramForm = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [errors, setErrors] = useState({ name: '', phone: '', message: '' });

  const validate = () => {
    let valid = true;
    const newErrors = { name: '', phone: '', message: '' };

    if (!/^[A-Za-z\s]{5,}$/.test(formData.name.trim())) {
      newErrors.name = "Ism faqat harflardan iborat bo'lishi va kamida 5 ta harf bo'lishi kerak.";
      valid = false;
    }

    if (!/^\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Telefon raqam 9 xonali bo'lishi kerak (masalan: 901234567).";
      valid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = "Xabar bo'sh bo'lmasligi kerak.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const text = `
Yangi xabar 📩

👤 Ism: ${formData.name}
📱 Telefon: +998${formData.phone}
✉️ Xabar: ${formData.message}
  `;

    try {
      const response = await fetch("https://api.flexenergy.uz/send-message", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      if (response.ok) {
        alert('Xabar muvaffaqiyatli yuborildi!');
        setFormData({ name: '', phone: '', message: '' });
        setErrors({ name: '', phone: '', message: '' });
      } else {
        throw new Error('Telegramga yuborishda xatolik yuz berdi.');
      }
    } catch (error) {
      console.error('Xatolik:', error);
      alert('Xabar yuborilmadi!');
    }
  };


  return (
    <Button containerClassName='rounded-md' borderClassName='rounded-md' duration={4000} className='rounded-md'>
      <form
        onSubmit={handleSubmit}
        className='sm:w-[40vw] w-[90vw] p-4 rounded-md bg-slate-800 shadow-md flex flex-col gap-4 justify-center items-center mx-auto'
      >

        {/* Name and Phone */}
        <div className='flex sm:flex-row flex-col gap-4 w-full'>
          {/* Name */}
          <div className='sm:w-[50%] w-full'>
            <input
              className='p-4 h-14 w-full outline-none bg-slate-900 rounded-md text-white'
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ismingiz"
              required
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Phone */}
          <div className='sm:w-[50%] w-full'>
            <div className='w-full flex gap-2 h-14'>
              <span className='p-4 flex items-center bg-slate-700 rounded-md text-white select-none'>+998</span>
              <input
                className='p-4 w-full outline-none bg-slate-900 rounded-md text-white'
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="901234567"
                required
                maxLength={9}
              />
            </div>
            {errors.phone && <p className="text-red-500 text-sm w-full">{errors.phone}</p>}
          </div>
        </div>

        {/* Message */}
        <div className='w-full'>
          <textarea
            className='p-4 w-full h-28 resize-none outline-none bg-slate-900 rounded-md text-white'
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Xabaringizni yozing..."
            required
          />
          {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className='bg-slate-400 hover:bg-accent hover:text-slate-400 transition-all cursor-pointer w-full p-4 rounded-md border-none outline-none text-white'
        >
          Yuborish
        </button>
      </form>
    </Button>
  );
};

export default TelegramForm;

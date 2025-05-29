import { useState } from 'react';
import { Button } from '../ui/moving-border';

const TelegramForm = () => {
  const [formData, setFormData] = useState({ name: '', number: '' });
  const [errors, setErrors] = useState({ name: '', number: '' });

  const BOT_TOKEN = import.meta.env.VITE_BOT_TOKEN;
  const CHAT_ID = import.meta.env.VITE_CHAT_ID;
  const SHEET_URL = import.meta.env.VITE_SHEET_URL;
  const validate = () => {
    let valid = true;
    const newErrors = { name: '', number: '' };

    if (!/^[A-Za-z\s]{5,}$/.test(formData.name.trim())) {
      newErrors.name = "Ism faqat harflardan iborat bo'lishi va kamida 5 ta harf bo'lishi kerak.";
      valid = false;
    }

    if (!/^\d{9}$/.test(formData.number)) {
      newErrors.number = "Telefon raqam 9 xonali bo'lishi kerak (masalan: 901234567).";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const fullNumber = `+998${formData.number}`;
    const messageText = `📥 Yangi so'rov:\n👤 Ism: ${formData.name}\n📞 Telefon: ${fullNumber}`;

    try {
      // 1. Google Sheetsga yuborish
      await fetch(SHEET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: fullNumber,
        }),
      });


      // 2. Telegram botga yuborish
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: messageText,
          parse_mode: 'HTML',
        }),
      });

      if (response.ok) {
        alert('Xabar muvaffaqiyatli yuborildi!');
        setFormData({ name: '', number: '' });
        setErrors({ name: '', number: '' });
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
      <form onSubmit={handleSubmit} className='sm:w-[40vw] p-4 rounded-md bg-slate-800 shadow-md flex flex-col gap-4 justify-center items-center mx-auto'>

        <input
          className='p-4 w-full outline-none h-full bg-slate-900 rounded-md text-white'
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ismingiz"
          required
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

        <div className='w-full flex gap-2'>
          <span className='p-4 bg-slate-700 rounded-md text-white select-none'>+998</span>
          <input
            className='p-4 w-full outline-none h-full bg-slate-900 rounded-md text-white'
            name="number"
            value={formData.number}
            onChange={handleChange}
            placeholder="Telefon (901234567)"
            required
            maxLength={9}
          />
        </div>
        {errors.number && <p className="text-red-500 text-sm w-full">{errors.number}</p>}

        <button className='bg-slate-900 w-full p-4 rounded-md border-none outline-none text-white' type="submit">Yuborish</button>
      </form>
    </Button>
  );
};

export default TelegramForm;

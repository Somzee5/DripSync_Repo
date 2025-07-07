import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import api from '../utils/api';
 
const TypingText = () => {
  const phrases = [
    "Your ultimate fashion guide.",
    "Personalized outfits just for you.",
    "Experience virtual try-ons!",
  ];
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentPhrase = phrases[index];
    const typingInterval = setInterval(() => {
      if (charIndex < currentPhrase.length) {
        setText((prev) => prev + currentPhrase[charIndex]);
        setCharIndex((prev) => prev + 1);
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setText("");
          setCharIndex(0);
          setIndex((prev) => (prev + 1) % phrases.length);
        }, 2000);
      }
    }, 100);
    return () => clearInterval(typingInterval);
  }, [charIndex, index]);

  return <div className="text-lg text-gray-400 mt-4">{text}</div>;
};


export default function Profile() {
  const { user_id } = useParams();
  const history = useHistory();

  const [profileData, setProfileData] = useState({
    gender: '',
    height: '',
    weight: '',
    age: '', 
    waist: '',
    skin_tone: '',
    captured_image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleFileChange = (e) => {
    setProfileData({ ...profileData, captured_image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(profileData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      await api.post(`/profile/${user_id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      history.push('/home');
    } catch (error) {
      console.error('Error creating profile:', error.response?.data || error.message);
    }
  };

  return (
    <div className="flex h-screen bg-black">
      <div className="flex flex-col justify-center items-start w-1/2 px-10">
        <h1 className="text-6xl font-extrabold text-indigo-400 tracking-wide">DripSync</h1>
        <TypingText />
      </div>

      <div className="flex justify-center items-center w-1/2 bg-gray-900 p-10">
        <div className="w-full max-w-sm space-y-6">
          <h2 className="text-center text-2xl font-semibold text-gray-100">Create Your Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-300">Gender</label>
              <select
                id="gender"
                name="gender"
                required
                value={profileData.gender}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-700 py-2 px-3 text-white focus:ring-indigo-500"
              >
                <option value="" disabled>Select your gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>

            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-300">Height (in cm)</label>
              <input
                id="height"
                name="height"
                type="number"
                required
                value={profileData.height}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-700 py-2 px-3 text-white focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-300">Weight (in kg)</label>
              <input
                id="weight"
                name="weight"
                type="number"
                required
                value={profileData.weight}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-700 py-2 px-3 text-white focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Skin Tone</label>
              <div className="flex space-x-4">
                {[
                  { id: 'EF', name: 'Extremely Fair Skin', color: '#ffe5d9' },
                  { id: 'OS', name: 'Olive Skin', color: '#d3a561' },
                  { id: 'MS', name: 'Medium Skin Undertone', color: '#c1a083' },
                  { id: 'NS', name: 'Neutral Skin Undertone', color: '#b68d7a' },
                  { id: 'BS', name: 'Brown Skin', color: '#8c603b' },
                  { id: 'DK', name: 'Dark Skin', color: '#59382d' },
                ].map((tone) => (
                  <div key={tone.id} className="flex items-center">
                    <input
                      type="radio"
                      id={tone.id}
                      name="skin_tone"
                      value={tone.id}
                      required
                      checked={profileData.skin_tone === tone.id}
                      onChange={handleChange}
                      className="hidden peer"
                    />
                    <label
                      htmlFor={tone.id}
                      className="block w-8 h-8 rounded-full cursor-pointer peer-checked:ring-2 peer-checked:ring-indigo-500"
                      style={{ backgroundColor: tone.color }}
                      title={tone.name} // Tooltip on hover
                    />
                  </div>
                ))}
              </div>
            </div>


            <div>
              <label htmlFor="waist" className="block text-sm font-medium text-gray-300">Waist (in cm)</label>
              <input
                id="waist"
                name="waist"
                type="number"
                required
                value={profileData.waist}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-700 py-2 px-3 text-white focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-300">Age</label>
              <input
                id="age"
                name="age"
                type="number"
                required
                value={profileData.age}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-700 py-2 px-3 text-white focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="captured_image" className="block text-sm font-medium text-gray-300">Upload Image</label>
              <input
                id="captured_image"
                type="file"
                name="captured_image"
                onChange={handleFileChange}
                accept="image/*"
                className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-700 py-2 px-3 text-white focus:ring-indigo-500"
              />
            </div>

            <button type="submit" className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600">
              Create Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Dropdown from "@/components/Dropdown";
import { useUserStore } from '@/store/userStore';
import { getFriendsList } from '@/services/friendship';
import { putProfile, putAvatar, deleteAvatar } from '@/services/profile';

const ProfileCard = () => {
  const profile = useUserStore((state) => state.profile);
  const setProfile = useUserStore((state) => state.setProfile);
  const [aboutMe, setAboutMe] = useState(profile?.bio);
  const [isEditing, setIsEditing] = useState(false);
  const [friendsCount, setFriendsCount] = useState(0);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  useEffect(() => {
    const loadFriends = async () => {
      try {
        const response = await getFriendsList();
        setFriendsCount(response.data?.length || 0);
      } catch (error) {
        console.error('Erro ao carregar amigos:', error);
        setFriendsCount(0);
      }
    };
    loadFriends();
  }, []);

  const handleSaveBio = async () => {
    try {
      const updatedProfile = await putProfile({ bio: aboutMe });
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar bio:', error);
      setAboutMe(profile?.bio);
    }
  };

  const handleUploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      const updatedProfile = await putAvatar(file);
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Erro ao fazer upload do avatar:', error);
    } finally {
      setIsUploadingAvatar(false);
      event.target.value = '';
    }
  };

  const handleDeleteAvatar = async () => {
    setIsUploadingAvatar(true);
    try {
      const updatedProfile = await deleteAvatar();
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Erro ao deletar avatar:', error);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <div className="grid grid-cols-12 grid-rows-24 gap-2 h-dvh">
      <Header />
      
      <div className="row-span-23 row-start-3 col-span-12 flex items-center justify-center">
        <div className="w-full max-w-[500px] bg-[#fbb034] border-4 border-[#5d1a1a] rounded-xl overflow-hidden">
          
          {/* Barra de Título com Link */}
          <div className="bg-[#8b2b2b] p-2 border-b-4 border-[#5d1a1a] flex justify-between items-center px-4">
          <h1 className="text-3xl text-[#fbb034] tracking-wider uppercase font-bold">Profile</h1>
          <Link href="/home" className="text-[#fbb034] hover:text-white text-sm font-bold border-2 border-[#fbb034] px-2 py-1 rounded">
            Go Back
          </Link>
        </div>

        <div className="p-6 text-[#5d1a1a]">
          {/* Topo: Avatar e Informações */}
          <div className="flex flex-wrap gap-6 mb-6">
            <div className="relative w-32 h-32 bg-[#4a90e2] border-4 border-[#1a1a1a] rounded-lg flex items-center justify-center overflow-hidden group">
              {profile?.avatar ? (
                <img
                  src={`http://localhost:8000${profile.avatar}`}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-6xl">🐱</span>
              )}
              
              {/* Overlay com botões */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <label className="cursor-pointer bg-[#5d1a1a] text-[#fbb034] px-2 py-1 rounded text-xs font-bold hover:bg-[#3a0f0f]">
                  {isUploadingAvatar ? 'Uploading...' : 'Upload'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadAvatar}
                    disabled={isUploadingAvatar}
                    className="hidden"
                  />
                </label>
                {profile?.avatar && (
                  <button
                    onClick={handleDeleteAvatar}
                    disabled={isUploadingAvatar}
                    className="cursor-pointer bg-[#1a0f2e] text-[#fbb034] px-2 py-1 rounded text-xs font-bold hover:bg-[#0d0618]"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 min-w-[200px]">
              <h2 className="text-4xl font-bold mb-2 tracking-tight text-[#5d1a1a]">{profile?.user.username}</h2>
              
              {/* About Me Editável - Estilo Botão/Caixa */}
              <div 
                className="bg-[#fbb034] border-4 border-[#5d1a1a] px-4 py-2 font-bold shadow-[4px_4px_0px_0px_#5d1a1a] cursor-pointer hover:bg-[#ffc25c] transition-all min-h-[60px]"
                onClick={() => !isEditing && setIsEditing(true)}
              >
                <p className="text-[10px] uppercase mb-1 opacity-60">About Me:</p>
                {isEditing ? (
                  <div>
                    <textarea 
                      autoFocus
                      className="w-full bg-transparent border-none outline-none text-sm resize-none p-0 h-full font-bold"
                      value={aboutMe}
                      onChange={(e) => setAboutMe(e.target.value)}
                    />
                    <div className="flex gap-2 mt-2">
                      <button 
                        onClick={handleSaveBio}
                        className="cursor-pointer bg-[#5d1a1a] text-[#fbb034] px-2 py-1 rounded text-xs font-bold hover:bg-[#3a0f0f]"
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => {
                          setAboutMe(profile?.bio);
                          setIsEditing(false);
                        }}
                        className="cursor-pointer bg-[#1a0f2e] text-[#fbb034] px-2 py-1 rounded text-xs font-bold hover:bg-[#0d0618]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm italic">{aboutMe && aboutMe !== '""' ? `${aboutMe}` : 'Write something about yourself...'}</p>
                )}
              </div>
              
              <div className="mt-4 flex gap-8">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  <span className="text-xl font-bold uppercase tracking-tighter">Win 0%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👥</span>
                  <span className="text-xl font-bold uppercase tracking-tighter">Friends {friendsCount}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-end mb-2">
            <p className="text-xl font-bold italic">Status: <span className="text-teal-700 font-black">{profile?.user.is_online ? 'Online' : 'Offline'}</span></p>
          </div>

          {/* Tabela de Rankings - Limpa e Espaçada */}
          <div className="border-4 border-[#5d1a1a] bg-[#fbb034]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-4 border-[#5d1a1a] bg-[#fcc15a]">
                  <th className="p-2 border-r-4 border-[#5d1a1a] uppercase text-sm">Rank</th>
                  <th className="p-2 border-r-4 border-[#5d1a1a] uppercase text-sm">Players</th>
                  <th className="p-2 border-r-4 border-[#5d1a1a] uppercase text-sm text-center">Win Rate</th>
                  <th className="p-2 border-r-4 border-[#5d1a1a] uppercase text-sm text-center">Win</th>
                  <th className="p-2 border-r-4 border-[#5d1a1a] uppercase text-sm text-center">Loss</th>
                  <th className="p-2 uppercase text-sm text-center">Points</th>
                </tr>
              </thead>
              <tbody className="font-bold">
                {[
                  { rank: "1 ✔", pseudo: "User2", rate: "100%", w: 3, l: 2, p: 24 },
                  { rank: "2", pseudo: "User1", rate: "0%", w: 2, l: 2, p: 20 },
                  { rank: "3", pseudo: "User3", rate: "0%", w: 1, l: 1, p: 20 },
                  { rank: "2", pseudo: "User4", rate: "0%", w: 0, l: 0, p: 8 },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-[#fcc15a]" : "bg-[#fbb034]"}>
                    <td className="p-2 border-r-4 border-[#5d1a1a]">{row.rank}</td>
                    <td className="p-2 border-r-4 border-[#5d1a1a]">{row.pseudo}</td>
                    <td className="p-2 border-r-4 border-[#5d1a1a] text-center">{row.rate}</td>
                    <td className="p-2 border-r-4 border-[#5d1a1a] text-center">{row.w}</td>
                    <td className="p-2 border-r-4 border-[#5d1a1a] text-center">{row.l}</td>
                    <td className="p-2 text-center">{row.p}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ProfileCard;
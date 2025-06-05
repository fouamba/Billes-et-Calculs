import React, { useState, useEffect } from 'react';
import { User, BookOpen, Star, Play, Settings, Users, Plus, HelpCircle, Info, FileText } from 'lucide-react';

// Types TypeScript pour l'application
interface Student {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  grade: 'CP' | 'CE1' | 'CE2';
  isRepeating: boolean;
  primarySchoolStartYear: number;
  fatherFirstName: string;
  fatherLastName: string;
  fatherProfession: string;
  motherFirstName: string;
  motherLastName: string;
  motherProfession: string;
  isActive: boolean;
  lastActivity?: string;
  progress?: {
    conceptualScope: number;
    sessionsCompleted: number;
    badgesEarned: number;
  };
}

const AddLearnHomepage: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'student-login' | 'teacher-dashboard' | 'student-registration'>('home');
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState<'disconnected'|'pending'|'connected'>('disconnected');

  // Données de démonstration
  const demoStudents: Student[] = [
    {
      id: '1',
      firstName: 'Emma',
      lastName: 'Dupont',
      birthDate: '2017-03-15',
      grade: 'CE1',
      isRepeating: false,
      primarySchoolStartYear: 2023,
      fatherFirstName: 'Pierre',
      fatherLastName: 'Dupont',
      fatherProfession: 'Ingénieur',
      motherFirstName: 'Marie',
      motherLastName: 'Dupont',
      motherProfession: 'Professeure',
      isActive: true,
      lastActivity: '2024-01-15',
      progress: {
        conceptualScope: 0.65,
        sessionsCompleted: 12,
        badgesEarned: 8
      }
    },
    {
      id: '2',
      firstName: 'Lucas',
      lastName: 'Martin',
      birthDate: '2016-09-22',
      grade: 'CE2',
      isRepeating: true,
      primarySchoolStartYear: 2022,
      fatherFirstName: 'Jean',
      fatherLastName: 'Martin',
      fatherProfession: 'Ouvrier',
      motherFirstName: 'Sophie',
      motherLastName: 'Martin',
      motherProfession: 'Employée',
      isActive: true,
      lastActivity: '2024-01-14',
      progress: {
        conceptualScope: 0.45,
        sessionsCompleted: 8,
        badgesEarned: 5
      }
    }
  ];

  useEffect(() => {
    setStudents(demoStudents);
  }, []);

  // Animation des billes flottantes dans le header
  useEffect(() => {
    const header = document.querySelector('.animated-header');
    if (!header) return;
    
    for (let i = 0; i < 8; i++) {
      const element = document.createElement('div');
      element.style.cssText = `
        position: absolute;
        width: ${12 + Math.random() * 16}px;
        height: ${12 + Math.random() * 16}px;
        background: ${['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#fd79a8', '#00b894', '#e17055'][i]};
        border-radius: 50%;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
        opacity: 0.7;
        z-index: 1;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      `;
      header.appendChild(element);
    }
    
    // Animation CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
        25% { transform: translateY(-15px) rotate(90deg) scale(1.1); }
        50% { transform: translateY(-25px) rotate(180deg) scale(0.9); }
        75% { transform: translateY(-10px) rotate(270deg) scale(1.05); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.querySelectorAll('.animated-header > div').forEach(el => el.remove());
      style.remove();
    };
  }, [currentView]);

  const handleStudentInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value.trim();
    setStudentName(name);
    setSearchTerm(name);
    if (name.length >= 2) {
      setStatus('pending');
    } else {
      setStatus('disconnected');
    }
  };

  const handleStudentLogin = (student: Student) => {
    setSelectedStudent(student);
    setStudentName(`${student.firstName} ${student.lastName}`);
    setIsConnected(true);
    setStatus('connected');
    alert(`Connexion de ${student.firstName} ${student.lastName} - Redirection vers les activités d'apprentissage`);
  };

  const filteredStudents = students.filter(student =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StudentRegistrationForm: React.FC = () => {
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      birthDate: '',
      grade: 'CP' as 'CP' | 'CE1' | 'CE2',
      isRepeating: false,
      primarySchoolStartYear: new Date().getFullYear(),
      fatherFirstName: '',
      fatherLastName: '',
      fatherProfession: '',
      motherFirstName: '',
      motherLastName: '',
      motherProfession: ''
    });

    const handleSubmit = () => {
      const newStudent: Student = {
        id: Date.now().toString(),
        ...formData,
        isActive: true,
        progress: {
          conceptualScope: 0,
          sessionsCompleted: 0,
          badgesEarned: 0
        }
      };
      setStudents([...students, newStudent]);
      setShowRegistrationForm(false);
      alert('Élève inscrit avec succès !');
    };

    return (
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-blue-600 mb-6 text-center">Inscription d'un nouvel élève</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Prénom de l'élève"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Nom de famille"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance</label>
              <input
                type="date"
                required
                value={formData.birthDate}
                onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Classe</label>
              <select
                value={formData.grade}
                onChange={(e) => setFormData({...formData, grade: e.target.value as 'CP' | 'CE1' | 'CE2'})}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="CP">CP</option>
                <option value="CE1">CE1</option>
                <option value="CE2">CE2</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isRepeating}
                  onChange={(e) => setFormData({...formData, isRepeating: e.target.checked})}
                  className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Élève redoublant</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Année début primaire</label>
              <input
                type="number"
                required
                min="2015"
                max="2030"
                value={formData.primarySchoolStartYear}
                onChange={(e) => setFormData({...formData, primarySchoolStartYear: parseInt(e.target.value)})}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          <div className="border-t-2 border-gray-100 pt-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <User className="mr-2" size={20} />
              Informations sur le père
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                required
                value={formData.fatherFirstName}
                onChange={(e) => setFormData({...formData, fatherFirstName: e.target.value})}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Prénom du père"
              />
              <input
                type="text"
                required
                value={formData.fatherLastName}
                onChange={(e) => setFormData({...formData, fatherLastName: e.target.value})}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Nom du père"
              />
              <input
                type="text"
                required
                value={formData.fatherProfession}
                onChange={(e) => setFormData({...formData, fatherProfession: e.target.value})}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Profession du père"
              />
            </div>
          </div>

          <div className="border-t-2 border-gray-100 pt-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <User className="mr-2" size={20} />
              Informations sur la mère
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                required
                value={formData.motherFirstName}
                onChange={(e) => setFormData({...formData, motherFirstName: e.target.value})}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Prénom de la mère"
              />
              <input
                type="text"
                required
                value={formData.motherLastName}
                onChange={(e) => setFormData({...formData, motherLastName: e.target.value})}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Nom de la mère"
              />
              <input
                type="text"
                required
                value={formData.motherProfession}
                onChange={(e) => setFormData({...formData, motherProfession: e.target.value})}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Profession de la mère"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => setShowRegistrationForm(false)}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all transform hover:scale-105"
            >
              Inscrire l'élève
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (currentView === 'home') {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          {/* Header animé avec background */}
          <header className="animated-header relative min-h-80 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
            </div>
            
            <div className="relative z-10 container mx-auto px-6 py-12">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300">
                    <BookOpen className="text-blue-600" size={32} />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                      ADDLEARN
                    </h1>
                    <p className="text-xl text-blue-100 font-medium">
                      Apprentissage Adaptatif des Problèmes Additifs
                    </p>
                  </div>
                </div>
                
                <div className="hidden md:flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-300 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-pink-300 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                </div>
              </div>
            </div>
          </header>

          {/* Navigation */}
          <nav className="bg-white shadow-lg border-b-4 border-blue-200">
            <div className="container mx-auto px-6 py-4">
              <div className="flex justify-center space-x-8">
                <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all shadow-lg">
                  <Play size={18} />
                  <span className="font-medium">À propos</span>
                </button>
                <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all shadow-lg">
                  <HelpCircle size={18} />
                  <span className="font-medium">Aide</span>
                </button>
                <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg">
                  <FileText size={18} />
                  <span className="font-medium">Instructions pédagogiques</span>
                </button>
              </div>
            </div>
          </nav>

          {/* Section de bienvenue */}
          <main className="container mx-auto px-6 py-12">
            <section className="bg-white rounded-2xl shadow-2xl p-8 mb-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-200 to-pink-200 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200 to-green-200 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
              
              <div className="relative z-10 text-center">
                <h2 className="text-4xl font-bold text-gray-800 mb-6">
                  Bienvenue dans ADDLEARN
                </h2>
                <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  Un environnement numérique d'apprentissage adaptatif pour développer 
                  les compétences en résolution de problèmes arithmétiques additifs
                </p>
              </div>
            </section>

            {/* Cartes d'authentification */}
            <section className="grid md:grid-cols-2 gap-8 mb-16">
              {/* Carte Élève */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-blue-500 transform hover:scale-105 transition-all duration-300">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <User className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Connexion Élève</h3>
                  <p className="text-gray-600 mb-6">
                    Connecte-toi avec ton nom pour commencer tes activités d'apprentissage personnalisées
                  </p>
                  
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Tape ton prénom et ton nom..."
                      value={studentName}
                      onChange={handleStudentInput}
                      className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-center"
                    />
                    
                    {/* Status de connexion */}
                    <div className={`p-3 rounded-lg text-center font-medium ${
                      status === 'connected' 
                        ? 'bg-green-100 text-green-700 border border-green-300' 
                        : status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                        : 'bg-gray-100 text-gray-600 border border-gray-300'
                    }`}>
                      {status === 'connected' 
                        ? `✅ Connecté : ${studentName}` 
                        : status === 'pending'
                        ? `👋 Salut ${studentName} !`
                        : '🔒 Non identifié'
                      }
                    </div>

                    {/* Liste des élèves filtrés */}
                    {studentName && status === 'pending' && (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {filteredStudents.length > 0 ? (
                          filteredStudents.map((student) => (
                            <button
                              key={student.id}
                              onClick={() => handleStudentLogin(student)}
                              className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg border hover:border-blue-300 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold text-gray-800">
                                    {student.firstName} {student.lastName}
                                  </p>
                                  <p className="text-sm text-gray-600">{student.grade}</p>
                                </div>
                                {student.progress && (
                                  <div className="flex items-center space-x-2">
                                    <Star className="text-yellow-500" size={16} />
                                    <span className="text-sm font-medium">{student.progress.badgesEarned}</span>
                                  </div>
                                )}
                              </div>
                            </button>
                          ))
                        ) : (
                          <p className="text-center text-gray-500 py-4">
                            Aucun élève trouvé. Vérifie l'orthographe de ton nom.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setCurrentView('student-login')}
                    className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all shadow-lg"
                  >
                    Accéder aux activités
                  </button>
                </div>
              </div>

              {/* Carte Enseignant */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-purple-500 transform hover:scale-105 transition-all duration-300">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Settings className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Espace Enseignant</h3>
                  <p className="text-gray-600 mb-8">
                    Gérez vos élèves, suivez leurs progrès et accédez aux données de recherche détaillées
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="text-gray-700">Élèves inscrits</span>
                      <span className="font-bold text-purple-600">{students.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-700">Sessions complétées</span>
                      <span className="font-bold text-green-600">
                        {students.reduce((sum, s) => sum + (s.progress?.sessionsCompleted || 0), 0)}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setCurrentView('teacher-dashboard')}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg"
                  >
                    Tableau de bord
                  </button>
                </div>
              </div>
            </section>

            {/* Carrousel des partenaires */}
            <section className="bg-white rounded-2xl shadow-xl p-8 mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">Nos Partenaires et Sponsors</h3>
              <div className="overflow-hidden">
                <div className="flex animate-scroll space-x-12">
                  {[
                    { name: 'Université Paris-Saclay', icon: '🎓' },
                    { name: 'CNRS Recherche', icon: '🔬' },
                    { name: 'École Primaire Les Tilleuls', icon: '🏫' },
                    { name: 'Innovation Pédagogique', icon: '💡' },
                    { name: 'Fondation Éducation', icon: '🌟' },
                    { name: 'Tech For Education', icon: '🚀' },
                    { name: 'Institut Piaget', icon: '🧠' },
                    { name: 'Ministère Éducation', icon: '🏛️' }
                  ].map((partner, index) => (
                    <div key={index} className="flex-shrink-0 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl shadow-md">
                        {partner.icon}
                      </div>
                      <p className="text-sm font-medium text-gray-700 whitespace-nowrap">{partner.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </main>

          {/* Footer avec informations sur le projet */}
          <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
            <div className="container mx-auto px-6 py-12">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold mb-8">À propos d'ADDLEARN</h3>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="text-white" size={24} />
                    </div>
                    <h4 className="text-xl font-semibold mb-3">Pédagogie Adaptative</h4>
                    <p className="text-gray-300 leading-relaxed">
                      Activités personnalisées basées sur la théorie des situations didactiques de Brousseau
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="text-white" size={24} />
                    </div>
                    <h4 className="text-xl font-semibold mb-3">Recherche Avancée</h4>
                    <p className="text-gray-300 leading-relaxed">
                      Collecte de données pour étudier les processus cognitifs d'apprentissage
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="text-white" size={24} />
                    </div>
                    <h4 className="text-xl font-semibold mb-3">Suivi Individuel</h4>
                    <p className="text-gray-300 leading-relaxed">
                      Progression personnalisée et analyse des facteurs socio-éducatifs
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-700 pt-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="text-center md:text-left mb-4 md:mb-0">
                    <p className="text-gray-300">© 2025 ADDLEARN - Environnement d'apprentissage adaptatif</p>
                    <p className="text-gray-400 text-sm">Projet de recherche en ingénierie cognitive</p>
                  </div>
                  <div className="flex space-x-6">
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">Confidentialité</a>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">Support</a>
                  </div>
                </div>
                <div className="text-center mt-6">
                  <p className="text-gray-400 text-sm">
                    Développé avec ❤️ pour l'éducation des enfants et la recherche en sciences cognitives
                  </p>
                </div>
              </div>
            </div>
          </footer>

          {/* Styles CSS intégrés pour les animations */}
          <style jsx>{`
            @keyframes scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-scroll {
              animation: scroll 20s linear infinite;
            }
          `}</style>
        </div>
      </>
    );
  }

  // Interface de connexion élève (page séparée)
  if (currentView === 'student-login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <span className="mr-2">←</span> Retour à l'accueil
            </button>
          </div>
        </header>

        <main className="container mx-auto px-6 py-12">
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <User className="text-white" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Connexion Élève</h2>
                <p className="text-gray-600">Tape ton nom pour commencer tes activités</p>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Tape ton prénom et ton nom..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-center"
                />

                {searchTerm && (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <button
                          key={student.id}
                          onClick={() => handleStudentLogin(student)}
                          className="w-full p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-xl border-2 hover:border-blue-300 transition-all transform hover:scale-105"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-800 text-lg">
                                {student.firstName} {student.lastName}
                              </p>
                              <p className="text-gray-600">{student.grade}</p>
                            </div>
                            {student.progress && (
                              <div className="flex items-center space-x-2">
                                <Star className="text-yellow-500" size={20} />
                                <span className="font-medium text-lg">{student.progress.badgesEarned}</span>
                              </div>
                            )}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">Aucun élève trouvé avec ce nom.</p>
                        <p className="text-sm text-gray-400">Vérifie l'orthographe ou demande à ton enseignant de t'inscrire.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Tableau de bord enseignant
  if (currentView === 'teacher-dashboard') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-lg">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentView('home')}
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                <span className="mr-2">←</span> Retour à l'accueil
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Tableau de bord enseignant</h1>
              <button
                onClick={() => setShowRegistrationForm(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 flex items-center space-x-2 shadow-lg transform hover:scale-105 transition-all"
              >
                <Plus size={18} />
                <span>Nouvel élève</span>
              </button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Élèves inscrits</h3>
              <p className="text-3xl font-bold">{students.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Sessions complétées</h3>
              <p className="text-3xl font-bold">
                {students.reduce((sum, s) => sum + (s.progress?.sessionsCompleted || 0), 0)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Badges gagnés</h3>
              <p className="text-3xl font-bold">
                {students.reduce((sum, s) => sum + (s.progress?.badgesEarned || 0), 0)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Progression moyenne</h3>
              <p className="text-3xl font-bold">
                {students.length > 0 
                  ? Math.round((students.reduce((sum, s) => sum + (s.progress?.conceptualScope || 0), 0) / students.length) * 100)
                  : 0}%
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Liste des élèves</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-6 font-semibold text-gray-700">Élève</th>
                    <th className="text-left py-3 px-6 font-semibold text-gray-700">Classe</th>
                    <th className="text-left py-3 px-6 font-semibold text-gray-700">Statut</th>
                    <th className="text-left py-3 px-6 font-semibold text-gray-700">Professions parents</th>
                    <th className="text-left py-3 px-6 font-semibold text-gray-700">Progression</th>
                    <th className="text-left py-3 px-6 font-semibold text-gray-700">Dernière activité</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr key={student.id} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-semibold text-gray-800">{student.firstName} {student.lastName}</p>
                          <p className="text-sm text-gray-500">{student.birthDate}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {student.grade}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {student.isRepeating ? (
                          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">Redoublant</span>
                        ) : (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Normal</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm">
                          <div className="mb-1">
                            <span className="font-medium">Père:</span> {student.fatherProfession}
                          </div>
                          <div>
                            <span className="font-medium">Mère:</span> {student.motherProfession}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {student.progress && (
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300" 
                                  style={{ width: `${student.progress.conceptualScope * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-600">
                                {Math.round(student.progress.conceptualScope * 100)}%
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">
                              {student.progress.sessionsCompleted} sessions • {student.progress.badgesEarned} badges
                            </p>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {student.lastActivity || 'Jamais'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return null;
};

export default AddLearnHomepage;
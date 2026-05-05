import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { addDays, addWeeks, startOfWeek, isBefore, differenceInHours } from 'date-fns';
import { Calendar as CalendarIcon, MessageCircle, Bell, BookOpen, Settings, ChevronRight } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { LessonCard } from './components/LessonCard';
import { ProgressBar } from './components/ProgressBar';
import { FAB } from './components/FAB';
import { BottomNav } from './components/BottomNav';
import { Modal } from './components/Modal';
import { Calendar } from './components/Calendar';
import { TimeSlotPicker } from './components/TimeSlotPicker';
import { Banner } from './components/Banner';
import { Card } from './components/Card';
import { Button } from './components/Button';

interface Lesson {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  instructorName: string;
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface Note {
  id: string;
  date: Date;
  text: string;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'schedule' | 'profile'>('home');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState<string>();
  const [bookingStep, setBookingStep] = useState<1 | 2>(1);
  const [notifications, setNotifications] = useState(true);
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: '1',
      date: addDays(new Date(), 2),
      startTime: '10:00',
      endTime: '11:30',
      instructorName: 'Олексій Петренко',
    },
  ]);
  const [notes] = useState<Note[]>([
    {
      id: '1',
      date: addDays(new Date(), -3),
      text: 'Чудова робота з паралельною парковкою! Продовжуйте практикуватись.',
    },
    {
      id: '2',
      date: addDays(new Date(), -10),
      text: 'Потрібно попрацювати над плавністю переключення передач.',
    },
  ]);

  if (!isLoggedIn) return <LoginPage onLogin={() => setIsLoggedIn(true)} />;


  const nextLesson = lessons.length > 0 ? lessons[0] : null;

  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const lessonsThisWeek = lessons.filter(
    (lesson) => lesson.date >= currentWeekStart && lesson.date < addWeeks(currentWeekStart, 1)
  ).length;

  const timeSlots: TimeSlot[] = [
    { id: '1', time: '08:00 - 09:30', available: true },
    { id: '2', time: '10:00 - 11:30', available: false },
    { id: '3', time: '12:00 - 13:30', available: true },
    { id: '4', time: '14:00 - 15:30', available: true },
    { id: '5', time: '16:00 - 17:30', available: false },
    { id: '6', time: '18:00 - 19:30', available: true },
  ];

  const hasAvailableSlots = timeSlots.some((slot) => slot.available);
  const canBookMore = lessonsThisWeek < 2;

  const handleOpenBooking = () => {
    setBookingModalOpen(true);
    setBookingStep(1);
    setSelectedDate(undefined);
    setSelectedSlot(undefined);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setBookingStep(2);
    }
  };

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedSlot) return;

    const slot = timeSlots.find((s) => s.id === selectedSlot);
    if (!slot) return;

    const [startTime, endTime] = slot.time.split(' - ');

    const newLesson: Lesson = {
      id: Date.now().toString(),
      date: selectedDate,
      startTime,
      endTime,
      instructorName: 'Олексій Петренко',
    };

    setLessons([...lessons, newLesson].sort((a, b) => a.date.getTime() - b.date.getTime()));
    setBookingModalOpen(false);
    toast.success('Заняття успішно заброньовано!', {
      className: 'bg-white/80 backdrop-blur-xl border-white/40 shadow-float rounded-2xl text-foreground font-medium'
    });
  };

  const handleJoinWaitlist = () => {
    setBookingModalOpen(false);
    toast.info('Ви додані до черги. Повідомимо, коли з\'явиться вільне місце.', {
      className: 'bg-white/80 backdrop-blur-xl border-white/40 shadow-float rounded-2xl text-foreground font-medium'
    });
  };

  const handleCancelLesson = () => {
    if (!nextLesson) return;

    const hoursUntilLesson = differenceInHours(nextLesson.date, new Date());

    if (hoursUntilLesson < 24) {
      setCancelModalOpen(true);
    } else {
      confirmCancel();
    }
  };

  const confirmCancel = () => {
    if (!nextLesson) return;

    setLessons(lessons.filter((lesson) => lesson.id !== nextLesson.id));
    setCancelModalOpen(false);
    toast.success('Заняття скасовано', {
      className: 'bg-white/80 backdrop-blur-xl border-white/40 shadow-float rounded-2xl text-foreground font-medium'
    });
  };

  return (
    <div className="min-h-screen bg-background pb-32 overflow-x-hidden">
      <Toaster 
        position="top-center" 
        toastOptions={{
          className: 'bg-white/90 backdrop-blur-xl border border-white/50 shadow-float rounded-2xl text-foreground font-semibold px-6 py-4'
        }} 
      />

      {/* Premium Header */}
      <header className="px-6 pt-12 pb-6 sticky top-0 z-20 bg-background/80 backdrop-blur-2xl border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Вітаємо, Максиме 👋</p>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              GoDrive
            </h1>
          </div>
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
             <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces" alt="User avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {activeTab === 'home' && (
        <main className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {nextLesson ? (
            <LessonCard lesson={nextLesson} onCancel={handleCancelLesson} />
          ) : (
            <Card variant="glass" className="flex flex-col items-center justify-center py-10">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                 <CalendarIcon size={28} className="text-primary" />
              </div>
              <p className="text-foreground font-medium text-lg mb-1">Немає занять</p>
              <p className="text-muted-foreground text-center max-w-[200px]">
                Забронюйте своє перше заняття, щоб почати навчання
              </p>
            </Card>
          )}

          <Card variant="glass">
            <h3 className="font-semibold text-foreground mb-4 text-lg">Прогрес тижня</h3>
            <ProgressBar value={lessonsThisWeek} max={2} label="Відкатано занять" />
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card interactive variant="glass" className="p-5 flex flex-col items-center text-center gap-3" onClick={handleOpenBooking}>
               <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                 <CalendarIcon size={24} />
               </div>
               <span className="font-semibold text-foreground text-sm">Забронювати<br/>заняття</span>
            </Card>
            
            <Card interactive variant="glass" className="p-5 flex flex-col items-center text-center gap-3">
               <div className="w-12 h-12 rounded-2xl bg-[#0088cc]/10 flex items-center justify-center text-[#0088cc]">
                 <MessageCircle size={24} />
               </div>
               <span className="font-semibold text-foreground text-sm">Telegram<br/>бот</span>
            </Card>
          </div>
        </main>
      )}

      {activeTab === 'schedule' && (
        <main className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-bold text-foreground">Мої заняття</h2>

          {lessons.length === 0 ? (
            <Card variant="glass" className="flex flex-col items-center justify-center py-12">
               <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                 <CalendarIcon size={28} className="text-muted-foreground" />
               </div>
              <p className="text-muted-foreground text-center font-medium">
                У вас ще немає запланованих занять
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <Card key={lesson.id} variant="glass" interactive>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-foreground text-lg">
                          {lesson.startTime} - {lesson.endTime}
                        </p>
                        <p className="text-sm font-medium text-primary mt-0.5 capitalize">
                          {lesson.date.toLocaleDateString('uk-UA', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                          })}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20">
                        Активне
                      </span>
                    </div>
                    <div className="h-px w-full bg-border/50 my-2" />
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                         <span className="text-[10px] font-bold text-foreground">{lesson.instructorName.charAt(0)}</span>
                      </div>
                      <p className="text-sm font-medium text-foreground/80">
                        {lesson.instructorName}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>
      )}

      {activeTab === 'profile' && (
        <main className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-bold text-foreground">Профіль</h2>

          <Card variant="glass" className="p-0 overflow-hidden">
            <div className="p-5 border-b border-border/50">
              <h3 className="font-semibold text-foreground mb-4">Налаштування</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground">
                      <Bell size={20} />
                    </div>
                    <span className="font-medium text-foreground">Сповіщення</span>
                  </div>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`w-12 h-7 rounded-full transition-all duration-300 relative ${
                      notifications ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-sm ${
                        notifications ? 'left-6' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                <button className="flex items-center justify-between w-full py-2 group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <Settings size={20} />
                    </div>
                    <span className="font-medium text-foreground">Загальні налаштування</span>
                  </div>
                  <ChevronRight size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              </div>
            </div>
            
            <div className="p-5 bg-gradient-to-br from-[#0088cc]/5 to-transparent">
              <div className="flex items-start gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-[#0088cc] flex items-center justify-center text-white shrink-0 shadow-soft">
                   <MessageCircle size={24} />
                 </div>
                 <div>
                   <h3 className="font-bold text-foreground mb-1">Telegram Бот</h3>
                   <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                     Отримуйте миттєві сповіщення про заняття та зміни в розкладі
                   </p>
                   <Button variant="primary" size="sm" className="bg-[#0088cc] hover:shadow-[#0088cc]/30 shadow-sm">
                     Підключити
                   </Button>
                 </div>
              </div>
            </div>
          </Card>

          <Card variant="glass">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                 <BookOpen size={18} />
              </div>
              Нотатки інструктора
            </h3>
            <div className="space-y-4 mt-2">
              {notes.map((note) => (
                <div key={note.id} className="relative pl-5 py-2">
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-full" />
                  <p className="text-[15px] text-foreground leading-relaxed font-medium">{note.text}</p>
                  <p className="text-xs font-semibold text-primary mt-2">
                    {note.date.toLocaleDateString('uk-UA')}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </main>
      )}

      {activeTab === 'home' && <FAB label="Забронювати" onClick={handleOpenBooking} />}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      <Modal
        open={bookingModalOpen}
        onOpenChange={setBookingModalOpen}
        title={bookingStep === 1 ? 'Оберіть дату' : 'Оберіть час'}
        footer={
          bookingStep === 2 && (
            <div className="flex gap-3 w-full">
              <Button variant="secondary" className="flex-1" onClick={() => setBookingStep(1)}>
                Назад
              </Button>
              {hasAvailableSlots ? (
                <Button className="flex-1" onClick={handleConfirmBooking} disabled={!selectedSlot || !canBookMore}>
                  Підтвердити
                </Button>
              ) : (
                <Button variant="outline" className="flex-1" onClick={handleJoinWaitlist}>Стати в чергу</Button>
              )}
            </div>
          )
        }
      >
        {!canBookMore && (
          <Banner variant="warning" className="mb-4">
            Ви вже маєте 2 заняття на цьому тижні. Бронювання нових занять недоступне.
          </Banner>
        )}

        {bookingStep === 1 && (
          <div className="bg-secondary/30 rounded-3xl p-2 border border-border/50">
             <Calendar
               selected={selectedDate}
               onSelect={handleDateSelect}
               disabled={(date) => isBefore(date, new Date()) || !canBookMore}
             />
          </div>
        )}

        {bookingStep === 2 && (
          <div className="space-y-4">
            {!hasAvailableSlots && (
              <Banner variant="info">
                На обрану дату немає вільних місць. Ви можете стати в чергу.
              </Banner>
            )}
            <TimeSlotPicker
              slots={timeSlots}
              selectedSlot={selectedSlot}
              onSelectSlot={setSelectedSlot}
            />
          </div>
        )}
      </Modal>

      <Modal
        open={cancelModalOpen}
        onOpenChange={setCancelModalOpen}
        title="Скасування заняття"
        footer={
          <div className="flex gap-3 w-full">
            <Button variant="secondary" className="flex-1" onClick={() => setCancelModalOpen(false)}>
              Назад
            </Button>
            <Button variant="danger" className="flex-1" onClick={confirmCancel}>
              Скасувати
            </Button>
          </div>
        }
      >
        <Banner variant="warning" className="mb-6">
          До заняття менше 24 годин. Можливе нарахування штрафних санкцій за пізнє скасування.
        </Banner>
        <p className="text-foreground/80 font-medium text-center">Ви дійсно бажаєте скасувати це заняття?</p>
      </Modal>
    </div>
  );
}

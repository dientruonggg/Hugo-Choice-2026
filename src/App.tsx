import React, { useState, useEffect } from 'react';
import { ScreenStep, VotingState, LiveResultsData } from './types';
import { INITIAL_LIVE_RESULTS } from './data/mockData';
import { BackgroundLandscape } from './components/BackgroundLandscape';
import { Header } from './components/Header';
import { BallotDrawer } from './components/BallotDrawer';
import { AdminLeaderboardModal } from './components/AdminLeaderboardModal';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { subscribeToAuthChanges, logoutGoogle } from './utils/firebase';
import { saveUserBallot, getSavedBallotForUser } from './utils/ballotStorage';

import { LandingScreen } from './components/screens/LandingScreen';
import { ProcessModalScreen } from './components/screens/ProcessModalScreen';
import { NameInputScreen } from './components/screens/NameInputScreen';
import { TeamSelectionScreen } from './components/screens/TeamSelectionScreen';
import { BestMemberScreen } from './components/screens/BestMemberScreen';
import { BestEventScreen } from './components/screens/BestEventScreen';
import { RookieScreen } from './components/screens/RookieScreen';
import { PerfectDuoScreen } from './components/screens/PerfectDuoScreen';
import { SubmissionScreen } from './components/screens/SubmissionScreen';

const STORAGE_KEY_VOTE = 'hugo_award_2024_user_state';
const STORAGE_KEY_RESULTS = 'hugo_award_2024_live_results';

export default function App() {
  const [currentStep, setCurrentStep] = useState<ScreenStep>('landing');
  const [isBallotDrawerOpen, setIsBallotDrawerOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isGoogleAuthOpen, setIsGoogleAuthOpen] = useState(false);

  // Voting State
  const [votingState, setVotingState] = useState<VotingState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VOTE);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return {
      userName: '',
      selectedTeam: null,
      selectedBestMember: null,
      selectedBestEvent: null,
      selectedRookie: null,
      selectedDuo: null,
      isSubmitted: false
    };
  });

  // Live Results Tally
  const [liveResults, setLiveResults] = useState<LiveResultsData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RESULTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_LIVE_RESULTS;
  });

  // Save voting state to localStorage and sync per user (gmail/name + ballot)
  useEffect(() => {
    try {
      if (votingState.userName || votingState.userEmail) {
        saveUserBallot(votingState);
      }
    } catch {
      // Ignore
    }
  }, [votingState]);

  // Save live results to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RESULTS, JSON.stringify(liveResults));
    } catch {
      // Ignore
    }
  }, [liveResults]);

  // Handle restoring or linking ballot for a logged in Google user
  const handleUserLogin = (user: { name: string; email: string; avatar: string }) => {
    const existingBallot = getSavedBallotForUser(user.email, user.name);
    if (existingBallot) {
      setVotingState({
        userName: user.name,
        userEmail: user.email,
        userAvatar: user.avatar,
        selectedTeam: existingBallot.selectedTeam as any,
        selectedBestMember: existingBallot.selectedBestMember,
        selectedBestEvent: existingBallot.selectedBestEvent,
        selectedRookie: existingBallot.selectedRookie,
        selectedDuo: existingBallot.selectedDuo,
        isSubmitted: existingBallot.isSubmitted,
        submittedAt: existingBallot.submittedAt
      });
    } else {
      setVotingState(prev => ({
        ...prev,
        userName: user.name,
        userEmail: user.email,
        userAvatar: user.avatar
      }));
    }
  };

  // Listen for Firebase Auth changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((firebaseUser) => {
      if (firebaseUser) {
        handleUserLogin(firebaseUser);
      }
    });
    return () => unsubscribe();
  }, []);

  // Step Navigation Helper
  const navigateTo = (step: ScreenStep) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit Ballot Handler
  const handleSubmitBallot = () => {
    if (votingState.isSubmitted) return;

    setVotingState(prev => ({
      ...prev,
      isSubmitted: true,
      submittedAt: new Date().toISOString()
    }));

    // Increment live results
    setLiveResults(prev => {
      const next = { ...prev, totalSubmissions: prev.totalSubmissions + 1 };

      if (votingState.selectedTeam) {
        next.teams = {
          ...next.teams,
          [votingState.selectedTeam]: (next.teams[votingState.selectedTeam] || 0) + 1
        };
      }
      if (votingState.selectedBestMember) {
        next.bestMember = {
          ...next.bestMember,
          [votingState.selectedBestMember]: (next.bestMember[votingState.selectedBestMember] || 0) + 1
        };
      }
      if (votingState.selectedBestEvent) {
        next.bestEvent = {
          ...next.bestEvent,
          [votingState.selectedBestEvent]: (next.bestEvent[votingState.selectedBestEvent] || 0) + 1
        };
      }
      if (votingState.selectedRookie) {
        next.rookie = {
          ...next.rookie,
          [votingState.selectedRookie]: (next.rookie[votingState.selectedRookie] || 0) + 1
        };
      }
      if (votingState.selectedDuo) {
        next.perfectDuo = {
          ...next.perfectDuo,
          [votingState.selectedDuo]: (next.perfectDuo[votingState.selectedDuo] || 0) + 1
        };
      }

      return next;
    });
  };

  // Reset & Logout Ballot Handler
  const handleReset = async () => {
    try {
      await logoutGoogle();
    } catch {
      // Ignore
    }
    setVotingState({
      userName: '',
      userEmail: undefined,
      userAvatar: undefined,
      selectedTeam: null,
      selectedBestMember: null,
      selectedBestEvent: null,
      selectedRookie: null,
      selectedDuo: null,
      isSubmitted: false
    });
    localStorage.removeItem(STORAGE_KEY_VOTE);
    navigateTo('landing');
  };

  return (
    <BackgroundLandscape>
      {/* Site Header */}
      <Header
        currentStep={currentStep}
        votingState={votingState}
        onNavigate={navigateTo}
        onOpenBallotDrawer={() => setIsBallotDrawerOpen(true)}
        onOpenAdminLeaderboard={() => setIsAdminModalOpen(true)}
        onOpenGoogleLogin={() => setIsGoogleAuthOpen(true)}
        onReset={handleReset}
        onLogout={handleReset}
      />

      {/* Screen Views */}
      <main className="flex-1 flex flex-col justify-between w-full min-h-0 overflow-hidden">
        {currentStep === 'landing' && (
          <LandingScreen
            userName={votingState.userName}
            onStart={() => navigateTo('process')}
            onRequireLogin={() => setIsGoogleAuthOpen(true)}
          />
        )}

        {currentStep === 'process' && (
          <ProcessModalScreen
            onProceed={() => navigateTo('name_input')}
          />
        )}

        {currentStep === 'name_input' && (
          <NameInputScreen
            initialName={votingState.userName}
            onBack={() => navigateTo('process')}
            onNext={(name, teamId) => {
              const existingBallot = getSavedBallotForUser(votingState.userEmail, name);
              if (existingBallot) {
                setVotingState({
                  userName: name,
                  userEmail: votingState.userEmail,
                  userAvatar: votingState.userAvatar,
                  selectedTeam: existingBallot.selectedTeam as any,
                  selectedBestMember: existingBallot.selectedBestMember,
                  selectedBestEvent: existingBallot.selectedBestEvent,
                  selectedRookie: existingBallot.selectedRookie,
                  selectedDuo: existingBallot.selectedDuo,
                  isSubmitted: existingBallot.isSubmitted,
                  submittedAt: existingBallot.submittedAt
                });
              } else {
                setVotingState(prev => ({
                  ...prev,
                  userName: name,
                  selectedTeam: teamId || prev.selectedTeam
                }));
              }
              navigateTo('team_selection');
            }}
          />
        )}

        {currentStep === 'team_selection' && (
          <TeamSelectionScreen
            selectedTeam={votingState.selectedTeam}
            onSelectTeam={(team) => setVotingState(prev => ({ ...prev, selectedTeam: team }))}
            onBack={() => navigateTo('name_input')}
            onNext={() => navigateTo('best_member')}
          />
        )}

        {currentStep === 'best_member' && (
          <BestMemberScreen
            selectedCandidateId={votingState.selectedBestMember}
            onSelectCandidate={(id) => setVotingState(prev => ({ ...prev, selectedBestMember: id }))}
            onBack={() => navigateTo('team_selection')}
            onNext={() => navigateTo('best_event')}
          />
        )}

        {currentStep === 'best_event' && (
          <BestEventScreen
            selectedEventId={votingState.selectedBestEvent}
            onSelectEvent={(id) => setVotingState(prev => ({ ...prev, selectedBestEvent: id }))}
            onBack={() => navigateTo('best_member')}
            onNext={() => navigateTo('rookie')}
          />
        )}

        {currentStep === 'rookie' && (
          <RookieScreen
            selectedRookieId={votingState.selectedRookie}
            onSelectRookie={(id) => setVotingState(prev => ({ ...prev, selectedRookie: id }))}
            onBack={() => navigateTo('best_event')}
            onNext={() => navigateTo('perfect_duo')}
          />
        )}

        {currentStep === 'perfect_duo' && (
          <PerfectDuoScreen
            selectedDuoId={votingState.selectedDuo}
            onSelectDuo={(id) => setVotingState(prev => ({ ...prev, selectedDuo: id }))}
            onBack={() => navigateTo('rookie')}
            onNext={() => navigateTo('submission')}
          />
        )}

        {currentStep === 'submission' && (
          <SubmissionScreen
            votingState={votingState}
            onSubmitBallot={handleSubmitBallot}
            onNavigate={navigateTo}
            onReset={handleReset}
            onOpenLeaderboard={() => setIsAdminModalOpen(true)}
          />
        )}
      </main>

      {/* Drawer: Ballot Review */}
      <BallotDrawer
        isOpen={isBallotDrawerOpen}
        onClose={() => setIsBallotDrawerOpen(false)}
        votingState={votingState}
        onNavigate={navigateTo}
      />

      {/* Modal: Admin Live Leaderboard */}
      <AdminLeaderboardModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        results={liveResults}
      />

      {/* Modal: Google Authentication */}
      <GoogleAuthModal
        isOpen={isGoogleAuthOpen}
        onClose={() => setIsGoogleAuthOpen(false)}
        onLoginSuccess={(user) => {
          handleUserLogin(user);
        }}
      />
    </BackgroundLandscape>
  );
}

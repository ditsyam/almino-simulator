import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/climateData';
import { HelpCircle, CheckCircle, XCircle, RotateCcw, Award } from 'lucide-react';

export const KnowledgeQuiz: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: number]: number }>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    if (showResults) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx
    }));
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  const allAnswered = QUIZ_QUESTIONS.every((q) => selectedAnswers[q.id] !== undefined);
  const score = calculateScore();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="p-6 sm:p-8 bg-slate-950/80 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Uji Pemahaman
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            Kuis Sains: 4 Mekanisme Pokok El Niño
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Uji sejauh mana Anda memahami hubungan kausalitas antara angin pasat, kolam air hangat, upwelling, dan Sirkulasi Walker.
          </p>
        </div>

        {showResults && (
          <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-xl border border-slate-700">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <div className="text-xs text-slate-400">Skor Anda:</div>
              <div className="text-base font-bold text-white">
                {score} / {QUIZ_QUESTIONS.length} Benar
              </div>
            </div>
            <button
              onClick={handleReset}
              className="ml-2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              title="Ulangi Kuis"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {QUIZ_QUESTIONS.map((q, idx) => {
          const userAns = selectedAnswers[q.id];
          const isCorrect = userAns === q.correctAnswer;

          return (
            <div
              key={q.id}
              className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-4"
            >
              <div className="font-bold text-sm sm:text-base text-slate-100 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-400 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{q.question}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {q.options.map((opt, optIdx) => {
                  const isSelected = userAns === optIdx;
                  let btnStyle = 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-850';

                  if (showResults) {
                    if (optIdx === q.correctAnswer) {
                      btnStyle = 'bg-emerald-500/20 border-emerald-500/60 text-emerald-200 font-semibold';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-500/20 border-rose-500/60 text-rose-300';
                    }
                  } else if (isSelected) {
                    btnStyle = 'bg-cyan-500/20 border-cyan-500/60 text-cyan-200 font-semibold';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm transition flex items-start gap-2.5 ${btnStyle}`}
                    >
                      <span className="font-mono text-slate-500 text-xs shrink-0">
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                      <span className="flex-1">{opt}</span>
                      {showResults && optIdx === q.correctAnswer && (
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {showResults && isSelected && optIdx !== q.correctAnswer && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {showResults && (
                <div
                  className={`p-3 rounded-xl text-xs leading-relaxed border ${
                    isCorrect
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-200'
                  }`}
                >
                  <span className="font-bold">Penjelasan: </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}

        <div className="flex items-center justify-between pt-4">
          <div className="text-xs text-slate-400">
            {Object.keys(selectedAnswers).length} dari {QUIZ_QUESTIONS.length} pertanyaan dijawab
          </div>

          {!showResults ? (
            <button
              onClick={() => setShowResults(true)}
              disabled={!allAnswered}
              className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition ${
                allAnswered
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              Periksa Jawaban
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Ulangi Kuis
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

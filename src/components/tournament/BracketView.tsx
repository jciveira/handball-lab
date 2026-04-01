import { useState } from 'react'
import { Trophy, Medal, Pencil } from 'lucide-react'
import { TeamLogo } from '../ui/TeamPicker'
import { ManualScoreEntry } from './ManualScoreEntry'
import { PenaltyShootout } from './PenaltyShootout'
import { getKnockoutWinner } from '../../lib/tournament-utils'
import { useTournamentStore } from '../../hooks/useTournamentStore'
import type { DbMatch, DbTeam } from '../../lib/database.types'

interface BracketViewProps {
  matches: DbMatch[]
  teamsMap: Map<string, DbTeam>
  isAdmin?: boolean
}

export function BracketView({ matches, teamsMap, isAdmin = false }: BracketViewProps) {
  const quarters = matches.filter((m) => m.phase === 'quarter')
  const semis = matches.filter((m) => m.phase === 'semi')
  const thirdPlace = matches.find((m) => m.phase === 'third_place')
  const final = matches.find((m) => m.phase === 'final')

  if (semis.length === 0 && quarters.length === 0) return null

  const finalWinner = final ? getKnockoutWinner(final) : null
  const thirdPlaceWinner = thirdPlace ? getKnockoutWinner(thirdPlace) : null

  return (
    <div className="flex flex-col gap-4 w-full">
      <h3 className="text-sm font-bold uppercase tracking-widest text-hbl-text-muted">Fase de eliminación</h3>

      {/* Quarterfinals */}
      {quarters.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs text-hbl-text-muted uppercase">Cuartos de final</span>
          {quarters.map((match, i) => (
            <KnockoutMatchRow key={match.id} match={match} teamsMap={teamsMap} label={`CF ${i + 1}`} isAdmin={isAdmin} />
          ))}
        </div>
      )}

      {/* Semifinals */}
      {semis.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs text-hbl-text-muted uppercase">Semifinales</span>
          {semis.map((match, i) => (
            <KnockoutMatchRow key={match.id} match={match} teamsMap={teamsMap} label={`Semi ${i + 1}`} isAdmin={isAdmin} />
          ))}
        </div>
      )}

      {/* 3rd Place */}
      {thirdPlace && (
        <div className="flex flex-col gap-2">
          <span className="text-xs text-hbl-text-muted uppercase">Tercer puesto</span>
          <KnockoutMatchRow match={thirdPlace} teamsMap={teamsMap} label="3er puesto" isAdmin={isAdmin} />
        </div>
      )}

      {/* Final */}
      {final && (
        <div className="flex flex-col gap-2">
          <span className="text-xs text-hbl-text-muted uppercase">Final</span>
          <KnockoutMatchRow match={final} teamsMap={teamsMap} label="Final" isAdmin={isAdmin} />
        </div>
      )}

      {/* Podium */}
      {finalWinner && (
        <div className="flex flex-col gap-2 p-4 rounded-xl bg-hbl-surface border border-hbl-accent">
          <span className="text-xs text-hbl-text-muted uppercase text-center">Podio</span>
          <PodiumRow position={1} teamId={finalWinner} teamsMap={teamsMap} />
          <PodiumRow
            position={2}
            teamId={final ? (finalWinner === final.home_team_id ? final.away_team_id : final.home_team_id) : null}
            teamsMap={teamsMap}
          />
          {thirdPlaceWinner && (
            <PodiumRow position={3} teamId={thirdPlaceWinner} teamsMap={teamsMap} />
          )}
        </div>
      )}
    </div>
  )
}

function PodiumRow({ position, teamId, teamsMap }: { position: number; teamId: string | null; teamsMap: Map<string, DbTeam> }) {
  if (!teamId) return null
  const team = teamsMap.get(teamId)
  const colors = { 1: 'text-yellow-400', 2: 'text-gray-300', 3: 'text-amber-600' }

  return (
    <div className="flex items-center gap-3 px-2">
      <span className={`text-lg font-bold ${colors[position as keyof typeof colors]}`}>
        {position === 1 ? <Trophy className="w-5 h-5" /> : <Medal className="w-5 h-5" />}
      </span>
      <span className={`text-sm font-bold ${colors[position as keyof typeof colors]}`}>{position}</span>
      <TeamLogo url={team?.badge_url} size={20} />
      <span className="text-sm font-medium">{team?.name ?? teamId}</span>
    </div>
  )
}

function KnockoutMatchRow({ match, teamsMap, label: _label, isAdmin = false }: { match: DbMatch; teamsMap: Map<string, DbTeam>; label: string; isAdmin?: boolean }) {
  const recordScore = useTournamentStore((s) => s.recordScore)
  const recordPenalties = useTournamentStore((s) => s.recordPenalties)
  const homeTeam = teamsMap.get(match.home_team_id)
  const awayTeam = teamsMap.get(match.away_team_id)
  const isFinished = match.status === 'finished'
  const isTied = isFinished && match.home_score === match.away_score
  const hasPenalties = match.penalty_home_score != null && match.penalty_away_score != null
  const winner = getKnockoutWinner(match)
  const [editing, setEditing] = useState(false)
  const [showPenalties, setShowPenalties] = useState(false)
  const needsPenalties = isTied && !hasPenalties

  if (editing) {
    return (
      <ManualScoreEntry
        homeTeamName={homeTeam?.name ?? 'Local'}
        awayTeamName={awayTeam?.name ?? 'Visitante'}
        initialHome={match.home_score ?? 0}
        initialAway={match.away_score ?? 0}
        onSubmit={async (h, a) => {
          await recordScore(match.id, h, a)
          setEditing(false)
        }}
        onCancel={() => setEditing(false)}
      />
    )
  }

  return (
    <>
      <div
        onClick={() => {
          if (!isFinished) setEditing(true)
          else if (needsPenalties) setShowPenalties(true)
        }}
        className={`relative flex items-center gap-2 px-3 py-2.5 rounded-lg bg-hbl-surface border text-sm w-full ${
          needsPenalties ? 'border-hbl-warning cursor-pointer' : isFinished ? 'border-hbl-border' : 'border-hbl-border hover:border-hbl-accent cursor-pointer'
        }`}
      >
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <TeamLogo url={homeTeam?.badge_url} size={16} />
          <span className={`truncate max-w-[80px] ${winner === match.home_team_id ? 'font-bold text-hbl-accent' : ''}`}>
            {homeTeam?.name ?? '?'}
          </span>
        </div>

        <div className="flex flex-col items-center min-w-[70px]">
          <span className={`font-mono text-base font-bold ${isFinished ? 'text-hbl-score' : 'text-hbl-text-muted'}`}>
            {isFinished ? `${match.home_score} - ${match.away_score}` : 'vs'}
          </span>
          {hasPenalties && (
            <span className="text-[10px] text-hbl-warning">
              pen: {match.penalty_home_score} - {match.penalty_away_score}
            </span>
          )}
          {needsPenalties && (
            <span className="text-[10px] text-hbl-warning animate-pulse">toca para penales</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
          <span className={`truncate max-w-[80px] text-right ${winner === match.away_team_id ? 'font-bold text-hbl-accent' : ''}`}>
            {awayTeam?.name ?? '?'}
          </span>
          <TeamLogo url={awayTeam?.badge_url} size={16} />
        </div>

        {isAdmin && isFinished && (
          <button
            onClick={(e) => { e.stopPropagation(); setEditing(true) }}
            className="absolute top-1.5 right-1.5 p-1 rounded text-hbl-text-muted hover:text-hbl-accent transition-colors"
            aria-label="Editar resultado"
          >
            <Pencil className="w-3 h-3" />
          </button>
        )}
      </div>

      {showPenalties && (
        <PenaltyShootout
          homeTeamName={homeTeam?.name ?? 'Local'}
          awayTeamName={awayTeam?.name ?? 'Visitante'}
          onSubmit={async (ph, pa) => {
            await recordPenalties(match.id, ph, pa)
            setShowPenalties(false)
          }}
          onCancel={() => setShowPenalties(false)}
        />
      )}
    </>
  )
}

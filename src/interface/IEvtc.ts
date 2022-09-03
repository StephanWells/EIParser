export default interface IEvtc {
    eliteInsightsVersion: string;
    triggerID: number;
    eiEncounterID: number;
    fightName: string;
    fightIcon: string;
    arcVersion: string;
    gW2Build: number;
    language: string;
    languageID: number;
    recordedBy: string;
    timeStart: string;
    timeEnd: string;
    timeStartStd: string;
    timeEndStd: string;
    duration: string;
    success: boolean;
    isCM: boolean;
    targets: TargetData[];
    players: PlayerData[];
    phases: PhaseData[];
    mechanics: MechanicsData[];
    uploadLinks: string[];
    skillMap: { [k: string]: SkillMap };
    buffMap: { [k: string]: BuffMap };
    damageModMap: { [k: string]: DamageModMap };
    personalBuffs: Record<Spec, number[]>;
    logErrors: string[];
    combatReplayMetaData: CombatReplayMetaData;
}

interface ActorData {
    isFake: boolean;
    dpsAll: AllDPS[];
    statsAll: AllStats[];
    defenses: DefenseData[];
    totalDamageDist: DamageData[][];
    totalDamageTaken: DamageData[][];
    rotation: RotationData[];
    damage1S: number[][];
    powerDamage1S: number[][];
    conditionDamage1S: number[][];
    breakbarDamage1S: number[][];
    conditionsStates: number[][];
    boonsStates: number[][];
    activeCombatMinions: number[][];
    healthPercents: number[][];
    barrierPercents: number[][];
}

interface TargetData extends ActorData {
    id: number;
    finalHealth: number;
    healthPercentBurned: number;
    firstAware: number;
    lastAware: number;
    buffs: SplitBuffData[];
    enemyPlayer: boolean;
    breakbarPercents: number[][];
    name: string;
    totalHealth: number;
    condition: number;
    concentration: number;
    healing: number;
    toughness: number;
    hitboxHeight: number;
    hitboxWidth: number;
    instanceID: number;
    combatReplayData: CombatReplayData;
}

interface PlayerData extends ActorData {
    account: string;
    group: number;
    hasCommanderTag: boolean;
    profession: string;
    friendlyNPC: boolean;
    notInSquad: boolean;
    guildID: string;
    weapons: string[];
    dpsTargets: DPSData[][];
    targetDamage1S: number[][][];
    targetPowerDamage1S: number[][][];
    targetConditionDamage1S: number[][][];
    targetBreakbarDamage1S: number[][][];
    targetDamageDist: DamageData[][][];
    statsTargets: Stats[][];
    support: {
        resurrects: number;
        resurrectTime: number;
        condiCleanse: number;
        condiCleanseTime: number;
        condiCleanseSelf: number;
        condiCleanseTimeSelf: number;
        boonStrips: number;
        boonStripsTime: number;
    }[];
    damageModifiers: DamageModifierData[];
    damageModifiersTarget: DamageModifierData[][];
    buffUptimes: SplitBuffData[];
    selfBuffs: BuffData[];
    groupBuffs: BuffData[];
    offGroupBuffs: BuffData[];
    squadBuffs: BuffData[];
    buffUptimesActive: SplitBuffData[];
    selfBuffsActive: BuffData[];
    groupBuffsActive: BuffData[];
    offGroupBuffsActive: BuffData[];
    squadBuffsActive: BuffData[];
    deathRecap: {
        deathTime: number;
        toDown: {
            id: number;
            indirectDamage: boolean;
            src: string;
            damage: number;
            time: number;
        }[];
        toKill: {
            id: number;
            src: string;
            damage: number;
            time: number;
        };
    }[];
    consumables: {
        stack: number;
        duration: number;
        time: number;
        id: number;
    }[];
    activeTimes: number[];
    name: string;
    totalHealth: number;
    condition: number;
    concentration: number;
    healing: number;
    toughness: number;
    hitboxHeight: number;
    hitboxWidth: number;
    instanceID: number;
    minions: {
        name: string;
        id: number;
        totalDamage: number[];
        totalTargetDamage: number[][];
        totalBreakbarDamage: number[];
        totalTargetBreakbarDamage: number[][];
        totalShieldDamage: number[];
        totalTargetShieldDamage: number[][];
        totalDamageDist: DamageData[][];
        targetDamageDist: number[][][];
        rotation: RotationData[];
    }[];
    rotation: RotationData[];
    activeCombatMinions: number[][];
    combatReplayData: CombatReplayPlayerData;
}

interface PhaseData {
    start: number;
    end: number;
    name: string;
    targets: number[];
    subPhases: number[];
    breakbarPhase: boolean;
}

interface MechanicsData {
    mechanicsData: {
        time: number;
        actor: string;
    }[];
    name: string;
    description: string;
}

interface AllDPS {
    dps: number;
    damage: number;
    condiDps: number;
    condiDamage: number;
    powerDps: number;
    powerDamage: number;
    breakbarDamage: number;
    actorDps: number;
    actorDamage: number;
    actorCondiDps: number;
    actorCondiDamage: number;
    actorPowerDps: number;
    actorPowerDamage: number;
    actorBreakbarDamage: number;
}

interface Stats {
    totalDamageCount: number;
    directDamageCount: number;
    connectedDirectDamageCount: number;
    connectedDamageCount: number;
    critableDirectDamageCount: number;
    criticalRate: number;
    criticalDmg: number;
    flankingRate: number;
    againstMovingRate: number;
    glanceRate: number;
    missed: number;
    evaded: number;
    blocked: number;
    interrupts: number;
    invulned: number;
    killed: number;
    downed: number;
}

interface AllStats extends Stats {
    wasted: number;
    timeWasted: number;
    saved: number;
    timeSaved: number;
    stackDist: number;
    distToCom: number;
    avgBoons: number;
    avgActiveBoons: number;
    avgConditions: number;
    avgActiveConditions: number;
    swapCount: number;
    skillCastUptime: number;
    skillCastUptimeNoAA: number;
}

interface DPSData {
    dps: number;
    damage: number;
    condiDps: string;
    condiDamage: string;
    powerDps: number;
    powerDamage: number;
    breakbarDamage: number;
    actorDps: number;
    actorDamage: number;
    actorCondiDps: string;
    actorCondiDamage: string;
    actorPowerDps: number;
    actorPowerDamage: number;
    actorBreakbarDamage: number;
}

interface DamageData {
    totalDamage: number;
    totalBreakbarDamage: number;
    min: number;
    max: number;
    hits: number;
    connectedHits: number;
    crit: number;
    glance: number;
    flank: number;
    againstMoving: number;
    missed: number;
    invulned: number;
    interrupted: number;
    evaded: number;
    blocked: number;
    shieldDamage: number;
    critDamage: number;
    id: number;
    indirectDamage: boolean;
}

interface DamageModifierData {
    id: number;
    damageModifiers: {
        hitCount: number;
        totalHitCount: number;
        damageGain: number;
        totalDamage: number;
    }[];
}

interface DefenseData {
    damageTaken: number;
    breakbarDamageTaken: string;
    blockedCount: number;
    evadedCount: number;
    missedCount: string;
    dodgeCount: number;
    invulnedCount: string;
    damageBarrier: number;
    interruptedCount: number;
    downCount: number;
    downDuration: number;
    deadCount: number;
    deadDuration: number;
    dcCount: string;
    dcDuration: string;
}

interface RotationData {
    id: number;
    skills: {
        castTime: number;
        duration: number;
        timeGained: number;
        quickness: number;
    }[];
}

interface BuffData {
    id: number;
    buffData: {
        generation: number;
        overstack: number;
        wasted: number;
        unknownExtended: number;
        byExtension: number;
        extended: number;
    }[];
}

interface SplitBuffData {
    id: number;
    states: number[][];
    buffData: {
        uptime: number;
        presence: number;
        generated: { [k: string]: number };
        overstacked: { [k: string]: number };
        wasted: { [k: string]: number };
        unknownExtended: { [k: string]: number };
        byExtension: { [k: string]: number };
        extended: { [k: string]: number };
    }[];
}

interface SkillMap {
    name: string;
    autoAttack: boolean;
    canCrit: boolean;
    icon: string;
    isSwap: boolean;
    isNotAccurate: boolean;
    conversionBasedHealing: boolean;
    hybridHealing: boolean;
}

interface BuffMap {
    name: string;
    icon: string;
    stacking: string;
    conversionBasedHealing: string;
    hybridHealing: string;
    descriptions: string[];
}

interface DamageModMap {
    name: string;
    icon: string;
    description: string;
    nonMultiplier: string;
    skillBased: string;
    approximate: string;
}

interface CombatReplayData {
    start: number;
    end: number;
    iconURL: string;
    positions: number[][];
    orientations: number[];
}

interface CombatReplayPlayerData extends CombatReplayData {
    dead: number[][];
    down: number[][];
    dc: number[][];
}

interface CombatReplayMetaData {
    inchToPixel: number;
    pollingRate: number;
    sizes: number[];
    maps: {
        url: string;
        interval: string[];
    }[];
}

export enum Spec {
    Bladesworn = "Bladesworn",
    Willbender = "Willbender",
    Vindicator = "Vindicator",
    Mechanist = "Mechanist",
    Untamed = "Untamed",
    Specter = "Specter",
    Virtuoso = "Virtuoso",
    Catalyst = "Catalyst",
    Harbinger = "Harbinger",
    Spellbreaker = "Spellbreaker",
    Firebrand = "Firebrand",
    Renegade = "Renegade",
    Holosmith = "Holosmith",
    Soulbeast = "Soulbeast",
    Deadeye = "Deadeye",
    Mirage = "Mirage",
    Weaver = "Weaver",
    Scourge = "Scourge",
    Berserker = "Berserker",
    Dragonhunter = "Dragonhunter",
    Herald = "Herald",
    Scrapper = "Scrapper",
    Druid = "Druid",
    Daredevil = "Daredevil",
    Chronomancer = "Chronomancer",
    Tempest = "Tempest",
    Reaper = "Reaper",
    Warrior = "Warrior",
    Guardian = "Guardian",
    Revenant = "Revenant",
    Engineer = "Engineer",
    Ranger = "Ranger",
    Thief = "Thief",
    Mesmer = "Mesmer",
    Elementalist = "Elementalist",
    Necromancer = "Necromancer",
}

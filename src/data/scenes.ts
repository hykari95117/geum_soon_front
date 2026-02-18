import type { DialogueLine } from '../components/GameScene'

// Scene에 사용되는 props
export interface SceneData {
    dialogues: DialogueLine[]
    backgroundUrl: string
    bgm: string
}

// 실제 Scene 데이터
export const scene1: SceneData = {
    dialogues: [
        {
            text: '어느 이른 아침, 초가집 안에 따스한 햇살이 스며든다.',
        },
        {
            character: '금순',
            text: '벌써 해가 떴네... 오늘도 바쁜 하루가 되겠구나.',
            characterImage: '/image/character/gs_baby.png',
        },
        {
            text: '금순이는 자리에서 일어나 방 안을 둘러보았다.',
        },
        {
            character: '금순',
            text: '어머니가 두고 가신 편지가 여기 있었지... 분명 어딘가에 놓아뒀는데.',
            characterImage: '/image/character/gs_baby.png',
        },
        {
            character: '금순',
            text: '오늘은 장에 나가서 쌀도 사고, 약초도 구해야 해.',
            characterImage: '/image/character/gs_baby.png',
        },
        {
            text: '금순이는 삿갓을 고쳐 쓰고 밖으로 나설 채비를 하기 시작했다.',
        },
    ],
    backgroundUrl: '/image/background/scene1/home.png',
    bgm: '/music/bgm/in_office.mp3',
}

export const scene2: SceneData = {
    dialogues: [
        {
            text: '넓은 들판에 형형색색의 꽃들이 가득 피어 있다.',
        },
        {
            character: '철수',
            text: '와... 여기 꽃이 정말 예쁘다!',
            characterImage: '/image/character/h95.png',
        },
        {
            character: '철수',
            text: '금순 누나가 약초를 구하러 간다고 했는데... 이 근처일까?',
            characterImage: '/image/character/h95.png',
        },
        {
            text: '철수는 꽃밭 사이로 난 좁은 길을 따라 걸어가기 시작했다.',
        },
        {
            character: '철수',
            text: '저기... 누군가 오고 있는 것 같은데?',
            characterImage: '/image/character/h95.png',
        },
    ],
    backgroundUrl: '/image/background/scene2/scene2.png',
    bgm: '/music/bgm/in_office.mp3',
}

/**
 * All scenes in sequential play order.
 * New scenes should be appended to this array -- no routing changes required.
 */
export const scenes: SceneData[] = [scene1, scene2]

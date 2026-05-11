
import generateRandomNickname from '@articles-media/articles-dev-box/generateRandomNickname';

const randomNicknameConfig = {
  type: 'Basic',
  parts: [
    [
      'Froggy', 'Jumping', 'LilyPad', 'Toadally', 'Croak', 'Swamp', 'Pond', 'Ribbit', 'LeapFrog', 'Tadpole',
      'Bog', 'Marsh', 'Fly', 'Green', 'Amphibian', 'Wetland', 'Hops', 'Slippery', 'Mud', 'Lotus'
    ],
    [
      'Master', 'Jester', 'Lord', 'Awesome', 'Commander', 'Surfer', 'Patrol', 'Ranger', 'Legend', 'Titan',
      'Boss', 'Monarch', 'Catcher', 'Glider', 'Ace', 'Warrior', 'Hero', 'Scout', 'Skipper', 'Leaper'
    ]
  ]
};

export default () => generateRandomNickname(randomNicknameConfig);
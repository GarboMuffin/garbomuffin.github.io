import { CANVAS_WIDTH } from "../engine/runtime";
import { Vector } from "../engine/vector";
import { Level } from "../level";
import { scratchCoordinate } from "../utils";
import { Nightlight } from "./game";
import { EndingSprite } from "./sprites/ending/EndingSprite";

/*
 * It's level data
 */

function goodbye() {
  new EndingSprite({
    position: new Vector(0, 0),
  });
}

// This is terrible and should be changed.
export function getLevels(game: Nightlight): Level[] {
  return [
    /* tslint:disable:max-line-length */
    // 0
    {
      levelData: "eaaaaaaaaafeaaaafeaaaaaaaaaaaaeaaaaaaaaafbccccdeaaaaaaaaaaaaeaaaaaaaaafooooooeaaaaaaaaaaaaeaaaaaaaaaf......eaaaaaaaaaaaaeaaaaaaaaaf......eaaaaaaaaaaaabcccccccccd......bcccmaaaaaaaajkpppkkpqkl......jkqpeaaaaaaaa.....................eaaaaaaaa.....................eamccccnc.....................bcdkpkq.k.....................qpl..............................................................................................................................................................................................................................................................................................................................................................................",
      background: "black",
      backgroundMusic: ["music/exploration"],
      text: [{
        text: "Small challenges",
        position: scratchCoordinate(-214, -26),
      }],
      stars: true,
    },
    // 1
    {
      levelData: "aaaaaaaaaafr.r.r.r.r.r.eaaaaaaaaaaaaaaaafo.o.o.o.o.o.eaaaaaaaaaaaaaaaaf............eaaaaaaaaaaaaaaaaf............eaaaaaaaaaaaaaaaaf............eaaaaaaaaaaaaaaaaf.gi.........eaaaaaaaaaaaaaaaaf.jl.........eaaaaaaaaaaaaaaaaf.......gi...eaaaaaaccccccccccd.......jl...eaaaaaaqkkpkpqqkkl...........gmaaaaaa.....................gmaaaaaaa.....................bcmaaaaaa.....................kqeaaaaaa............ghhhhi.....eaaaaaa............jpqqkl.....eaaaaaa......ghi..............eaaaaaa......qkp..............eaaaaaa.......................eaaaaaa.............ghhhhi....bccnccc.............jqkkpl....pkq.kqk..........................................................................................",
      text: [{
        text: "Higher Hills!",
        position: scratchCoordinate(-40, -124),
      }],
    },
    // 2
    {
      levelData: "aaaaaaf..............srrrrrrrraaaaaaf..............srrrrrrrraaaaaaf..............srrrrrrrraaaaaaf..............sssssrrrraaaaaaf..................srrrraaaaaaf..t....t..........srrrraaaaaaf..................srrrraaaaaaf..................ssnssaaaaaaf.......................ccccccd.......................kpkqqkl....gi............................ef.........ghhhhhhh...........ef.......ghmaaaaaaa...........ef......gmaaaaaaaaa...........emhhhhhhmaaaaaaaaaa...........eaaaaaaaaaaaaaaaaaa.........ghmaaaaaaaaaaaaaaaaaa.......ghmaaaaaaaaaaaaaaaaaaaa.....ghmaaaaaaaaaaaaaaaaaaaaaa...ghmaaaaaaaaaaaaaaaaaaaaaaaa..gmaaaaaaaaaaaaaaaaaaaaaaaaaa.gmaaaaaaaaaaaaaaaaaaaaaaaaaaa.eaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      text: [{
        text: "They crumble beneath you!",
        position: scratchCoordinate(-112, -144),
      }],
    },
    // 3
    {
      levelData: "rrrrrs...................srrrrrrrrrs...................srrrrrrrrrs...................srrrrrrrrrs...................srrrrrrssss...................ssnssrrs......t...t................rrs...........................sss..............t...................................................gi............................emhi.................hi......gmaaf.................amhi...gmaaami...............gaaamhhhmaaaaamhi...........ghmaaaaaaaaaaaaaaamhhi.....ghhmaaaaaaaaaaaaaaaaaaaamhhhhhmaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      text: [{
          text: "Watch your faces...",
          position: scratchCoordinate(-80, 92),
        }, {
          text: "All six of them",
          position: scratchCoordinate(-64, 84),
        },
      ],
    },
    // 4
    {
      levelData: "aaaaaf.............t....eaaaaaaaaaaf...t..............bcmaaaaaaaaf........t...........bmaaaaamcd.....................bcmmccd.........................ef...........................gmf.....ghhhvvvvvvhhhi.......gmami...gmmcdoo..oobccmhhi....peafp..gmaf...........bcmmhhi..eaf...qeaf.............bmafp..eami...em]i.............emd...eaami..efpp..ghhhi......ef...gmaafq..ef....pqncmi....gmd...eaaaf...bmi.......ef....bd....eaaaf....ef.......ef....w....gmaaami...ef.ghhhhhmmi...w....eaaaaami..emhmccuccmamhi.w..ghmaaaaaaf..bccd.....bmaamhhhhmaaaaaaaaf............eaaaaaaaaaaaaaaaami..........gmaaaaaaaaaaaaaaaaami.......ghmaaaaaaaaaaaaaaaaaaamhhhhhhhmaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    },
    // 5
    {
      levelData: "aaaaaaaaaaafbccccdeaaaaaaaaaaaaaaaaaaaaaafooooooeaaaaaaaaaaaaaaaaaaaaaaf......eaaaaaaaaaaaaaaaaaaaaaaf......eaaaaaaaaaaaaaaaaaaaaaaf......eaaaaaaaaaaaaaaaaaaaaaaf......eaaaaaaaaaaaaaaaaaaaaaaf......eaaaaaaaaaaacccccccccccd......bccccccccccckkpppkkqpkkl......jkqkqkkpqqpp....................................................................................................................................................................................................................................................................................................................................................................................................................................",
      boss: {
        type: "sword"
      },
      backgroundMusic: ["music/boss/1", "music/boss/2"],
    },
    // 6
    {
      levelData: "aaaaaa5...................4aaaaaaaaa5...........y.......4aaaaaaaaa5...................4aaaaaaaaa5.....y.zzz.........1222aaaaaa5............zzz......x.aaaaaa5.......................2222223..zzz..............................................................................................................y..........................................................................................................................y678...........................4a5..........67778............123...t......4aaa5......68..............t..12n23......13....................................................................................................................................................",
      backgroundMusic: ["music/blackroad/1", "music/blackroad/2"],
    },
    // 7
    {
      levelData: "aaaaaaaaaaaaaaaa5..!!!!!4aa5..aaaaaaaaaaaaaaaa5.....x.4aa98.aaaaaaaaaaaaaaaa5.......4aaa5.a9222222222229aa5.......4aaa98a5...w..w....4aa5..!!!!!122223a5...w.......4aa5.......aaaa..a5...w.......4aa5.......aaaa..a5.........!!4aa5!!!!!!!6778!.a5...........4aa5ooooooo4aa5..a978.........1223.......1223..aaa978........................aaaaa98.......................aaaaaa98......................aaaaaaa9778!!!!!..............229a9222223....................z1u3z.........................z...z......68ww68.............z...z......45!!45.............zzzzz......45..45........................45..45........................45..45........................497@95........................4aaaa5............",
    },
    // 8
    {
      levelData: "aaaa5...ooo45.45..45..soo4aaaaaaaa5......13.13..13..s..4aaaaaaaa5....s............s..4aaaa22223....s..#s$.......s..12222.........s..#ssss%s...s.......8........s..#ssssss!!!s.......978.....ss..#ss.......s.......aa98.....s...s$.sssssss@s.....aaa98....s...s$.s.......s.....aaaa98...s$..s$!s.......s.....aaaa93...s$..s$.s.......s.....aaaa5....s$..s$.s.......s.....aaaa5....s$..s$.s.......s.....aaaa5....s...s$!s.......s.....aaaa5...ss...s$.s.......s.....aaaa5....s..#s$.s!!!!!!!s.....aaaa5....s..#s$.sooooooos.....aaaa5....s..#s$!s......!s.....aaaa5.......#s$...............aaaa5.......ss$...............aaaa97778...ss$...............aaaaaaaa97778.................aaaaaaaaaaaa5.................",
    },
    // 9
    {
      levelData: "aaaaaaaaa5oooooooo4aa5......4aaaaaaaaaa5........4aa5......4aaaaaaaaaa5........1223......4a22222229a5..................4a.......4a5..................4a.......4a5..................4a.......4a5.............%....4a8ss....4a5.............o....4a5oo....4a5..................4a5......4a5..................4a5......4a5..................4a5......4a5...678............4a5....ss4a5...4a5.......%....4a5....oo4a5...4a5.......o....4a5......4a5...4a5............4a5......4a5...4a5............4a5......4a5...4a5............4a5s.....4a5...4a5............4a5o.....123...4a5.......%....4a5............4a5.......o....1n5............4a5..............5............4a5..............5............4a5..............",
      text: [{
        text: "Touch a dot, jump again!",
        position: scratchCoordinate(-56, -108),
      }],
      jumpLights: [
        scratchCoordinate(-168, -60),
        scratchCoordinate(-184, 20),
        scratchCoordinate(-168, 100),
        scratchCoordinate(-56, 36),
        scratchCoordinate(136, -132),
        scratchCoordinate(184, -76),
        scratchCoordinate(136, -20),
        scratchCoordinate(88, 20),
        scratchCoordinate(136, 76),
        scratchCoordinate(184, 116),
      ],
    },
    // 10
    {
      levelData: "4aaaaaaaaaaaaa5............4aa4aaaaaaaaaaaaa5............4aa4aaaaaaaaaaaaa5............4aa4aaaaaaaaaaaaa5............1n2122222222222223............w........y....................w........y.............zzz....w..$..#ss$.#s..........z.z....w..$...#s$.#s..........z.z....w..$....s$.#s....%.....zzz....w..s$...s$.#s...#s$...........w..ss$..s$.#s...#s$...........w..sss!!s$.#s...#s$...........w..sx...s$.#s...#s$...........w..s....s$.#s...#s$...........w.......su!ss...#s$...........w.......s...s...#s$...........w.......s...s...#s$...........w.......s...s...#s$...........w.......s!!!s...#s$..........#s$..............#s$..........#s$..............#s$..........#s$..............#s$..........#s$.",
      jumpLights: [
        scratchCoordinate(-200, 116),
        scratchCoordinate(104, -52),
        scratchCoordinate(-120, -44),
        scratchCoordinate(-120, 36),
        scratchCoordinate(-200, -28),
      ],
    },
    // 11
    {
      levelData: "aaaaaa5....................4aaaaa92n3....................4aaaaa5......................69aaaaa5.....................6aaaaaaa9778..................129aaaaaaaa5....................4aaaaaaaa5....................4aaaaaaaa5....................4aaaaaaaa5....................4aaaaaaaa5....................4aaaaaaaa5....................4aaaaaaaa5....................4aaaaaaaa5....................4aa2222223[[[[[[[[[[[[[[[[[[[[1u2..............................................................................................................................................................................................................................................................................",
      jumpLights: [
        scratchCoordinate(104, -28),
        scratchCoordinate(-80, -116),
      ],
    },
    // 12
    {
      levelData: "2222222222229aaaa9222222222222............4aaaa5........................4aaaa5........................122223......................................._=+...........................)^-...........................)^-...........................)^-......6778.................)^-......1223.................)^-...........................)^-...........................)^-...........................)^-.......................6777)^-.......................1222)^-...........................)^-...........................)^-...67778...................)^-...12223...................)^-...........................)^-.........................._`^-..........................&**(..............................",
      boss: {
        type: "noss1"
      },
      backgroundMusic: ["music/boss/1", "music/boss/2"],
      jumpLights: [
        scratchCoordinate(0, -44),
        scratchCoordinate(0, 20),
        scratchCoordinate(0, 84),
      ],
    },
    // 13
    {
      levelData: "^^^-..........................^^^-..........................***(...t...................................t.............................................................................................t.....................................................................................t.......t................t..............................................................................u.......................................t.....%%%..........................%_=+%........................#_`^`+$.......................#)^^^-$.......................#&*n*($........%%%..............w.w.........._=+..............www..........)^-...........................)^-...........................)^-.",
      background: "castle",
      backgroundMusic: ["music/netherslament"],
      text: [{
        text: "Your final challenges.",
        position: scratchCoordinate(56, -127),
      }],
      stars: false,
    },
    // 14
    {
      levelData: "^^^^-......................)^^^^^^-......................)^^****(...t...t...t...t..t..t)^^...........................)^^...........................)^^...........................&**....._==================+..........)`*****************(.....=====`-oooooooooooooooooo.....******(..t...t...t...t...t.....................................................................t.............................._=======================......&*******************`^^^......oooooooooooooooooooo)^^^......t....t....t....t....&*n*........................................................................................................................==============================^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
    },
    // 15
    {
      levelData: "^^^^-....................)^^^^^^^^-....................)^^^^****(....................&*u**.....................................................................................................................................................................................................................................................................................................................................%%%%%====+...................._====^^^^-....................)^^^^****(....................&*n**..x......................zw.wz.........................zwwwz.........................zzzzz..........................................................................................",
      text: [{
        text: "Timing is everything",
        position: scratchCoordinate(-80, -130),
      }],
      jumpLights: [
        scratchCoordinate(-144, -60),
        scratchCoordinate(-144, 0),
        scratchCoordinate(-144, 60),
        scratchCoordinate(0, -44),
        scratchCoordinate(144, -60),
        scratchCoordinate(144, 0),
        scratchCoordinate(144, 60),
      ],
    },
    // 16
    {
      levelData: "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^`****************************`-...........................#)-...........................#)-...........................#)-!!_+......y.....zww..._+z..#)-..)-..................)-...#)-..)-..................)-...#)-%.)-..................)-...#)-sz)-......y.......zww.)-z..#)-..)-..................)-...#)-..)-..................)-...#)-.%)-..................)-...#)-zs)-......y.....wwz...)-z..#)-..)-..................)-...#)-..)-..................)-...#)-%.)-......s........._=`-s..#)-uz&(......x.........&n`-x..#)-....................w.)-...#)-....................w.)-...#)`======================``====`^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
    },
    // 17
    {
      levelData: "^^^^^^^^^^^^-....)^^^^^^^-....^^^^^^^^^^^^-....)^^^^^^^-....************(....&*******(................................................................................................yyy......................t.................................................................y..........ss............................x..............t.................................w............................w.w..........................._@+....................t......)^-................t..........&u(...t...t...t.................................................................................................................................................................................................",
      dark: true,
      backgroundMusic: ["music/challenge"],
    },
    // 18
    {
      levelData: "^^^^^^^^-oooooooooooo)^^^^^^^^^^^^^^^^-............)^^^^^^^^^^^^^^^^-............)^^^^^^^^********(............&********................................................................................................................................................................................................................................................==================+$..........^^^^^^^^^^^^^^^^^^-$..........`*****************($..........-.............................-.............................-.............................-.............................-.............................-.............................`=@=======+...................^^^^^^^^^^-...................",
      dark: true,
      jumpLights: [
        scratchCoordinate(0, -52),
        scratchCoordinate(104, 20),
        scratchCoordinate(176, -35),
      ],
    },
    // 19
    {
      levelData: "..)^^^^^^^^^^^^^^^^^^^^^^^^-....)^^^^^^^^^^^^^^^^^^^^^^^^-....&************************(..........................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................",
      backgroundMusic: ["music/finalboss/1", "music/finalboss/2"],
      boss: {
        type: "noss2",
      },
      spawn: {
        type: "range",
        minX: 0,
        maxX: CANVAS_WIDTH,
      },
      background: "black",
      stars: true,
    },
    // Goodbye
    {
      levelData: "",
      backgroundMusic: [],
      handlers: [goodbye],
      stars: false,
    },
    /* tslint:enable:max-line-length */
  ];
}
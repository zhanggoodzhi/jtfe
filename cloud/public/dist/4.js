webpackJsonp([4],{

/***/ 1081:
/***/ (function(module, exports, __webpack_require__) {



    var windingLine = __webpack_require__(508);

    var EPSILON = 1e-8;

    function isAroundEqual(a, b) {
        return Math.abs(a - b) < EPSILON;
    }

    function contain(points, x, y) {
        var w = 0;
        var p = points[0];

        if (!p) {
            return false;
        }

        for (var i = 1; i < points.length; i++) {
            var p2 = points[i];
            w += windingLine(p[0], p[1], p2[0], p2[1], x, y);
            p = p2;
        }

        // Close polygon
        var p0 = points[0];
        if (!isAroundEqual(p[0], p0[0]) || !isAroundEqual(p[1], p0[1])) {
            w += windingLine(p[0], p[1], p0[0], p0[1], x, y);
        }

        return w !== 0;
    }


    module.exports = {
        contain: contain
    };


/***/ }),

/***/ 1105:
/***/ (function(module, exports) {

module.exports = {"type":"FeatureCollection","features":[{"id":"710000","geometry":{"type":"MultiPolygon","coordinates":[["@@°Ü¯Û","@@ƛĴÕƊÉɼģºðʀ\\ƎsÆNŌÔĚänÜƤɊĂǀĆĴĤǊŨxĚĮǂƺòƌâÔ®ĮXŦţƸZûÐƕƑGđ¨ĭMó·ęcëƝɉlÝƯֹÅŃ^Ó·śŃǋƏďíåɛGɉ¿IċããF¥ĘWǬÏĶñÄ","@@\\p|WoYG¿¥Ij@","@@¡@V^RqBbAnTXeQr©C","@@ÆEEkWqë I"]],"encodeOffsets":[[[122886,24033],[123335,22980],[122375,24193],[122518,24117],[124427,22618]]]},"properties":{"cp":[121.509062,25.044332],"name":"台湾","childNum":5}},{"id":"130000","geometry":{"type":"MultiPolygon","coordinates":[["@@\\aM`Ç½ÓnUKĜēs¤­©yrý§uģcJ»eIP]ªrºc_ħ²G¼s`jÎŸnüsÂľP","@@U`Ts¿mÄ","@@FOhđ©OiÃ`ww^ÌkÑH«ƇǤŗĺtFu{Z}Ö@U´ʚLg®¯Oı°Ãw ^VbÉsmAê]]w§RRl£ŭuwNÁ`ÇFēÝčȻuT¡Ĺ¯Õ¯sŗő£YªhVƍ£ƅnëYNgq¼ś¿µı²UºÝUąąŖóxV@tƯJ]eR¾fe|rHA|h~Ėƍl§ÏjVë` ØoÅbbx³^zÃĶ¶Sj®AyÂhðk`«PËµEFÛ¬Y¨Ļrõqi¼Wi°§Ð±²°`[À|ĠO@ÆxO\\ta\\p_Zõ^û{ġȧXýĪÓjùÎRb^Î»j{íděYfíÙTymńŵōHim½éŅ­aVcř§ax¹XŻácWU£ôãºQ¨÷Ñws¥qEHÙ|šYQoŕÇyáĂ£MÃ°oťÊP¡mWO¡v{ôvîēÜISpÌhp¨ jdeŔQÖjX³àĈ[n`Yp@UcM`RKhEbpŞlNut®EtqnsÁgAiúoHqCXhfgu~ÏWP½¢G^}¯ÅīGCÑ^ãziMáļMTÃƘrMc|O_¯Ŏ´|morDkO\\mĆJfl@cĢ¬¢aĦtRıÒXòë¬WP{ŵǫƝīÛ÷ąV×qƥV¿aȉd³BqPBmaËđŻģmÅ®V¹d^KKonYg¯XhqaLdu¥Ípǅ¡KąÅkĝęěhq}HyÃ]¹ǧ£Í÷¿qágPmoei¤o^á¾ZEY^Ný{nOl±Í@Mċèk§daNaÇį¿]øRiiñEūiǱàUtėGyl}ÓM}jpEC~¡FtoQiHkk{ILgĽxqÈƋÄdeVDJj£J|ÅdzÂFt~KŨ¸IÆv|¢r}èonb}`RÎÄn°ÒdÞ²^®lnÐèĄlðÓ×]ªÆ}LiĂ±Ö`^°Ç¶p®đDcŋ`ZÔ¶êqvFÆN®ĆTH®¦O¾IbÐã´BĐɢŴÆíȦpĐÞXR·nndO¤OÀĈƒ­QgµFo|gȒęSWb©osx|hYhgŃfmÖĩnºTÌSp¢dYĤ¶UĈjlǐpäðëx³kÛfw²Xjz~ÂqbTÑěŨ@|oMzv¢ZrÃVw¬ŧĖ¸f°ÐTªqs{S¯r æÝl¼ÖĞ ǆiGĘJ¼lr}~K¨ŸƐÌWö¼Þ°nÞoĦL|C~D©|q]SvKÑcwpÏÏĿćènĪWlĄkT}¬Tp~®Hgd˒ĺBVtEÀ¢ôPĎƗè@~kü\\rÊĔÖæW_§¼F´©òDòjYÈrbĞāøŀG{ƀ|¦ðrb|ÀH`pʞkvGpuARhÞÆǶgĘTǼƹS£¨¡ù³ŘÍ]¿ÂyôEP xX¶¹ÜO¡gÚ¡IwÃé¦ÅBÏ|Ç°N«úmH¯âbęU~xĈbȒ{^xÖlD¸dɂ~"]],"encodeOffsets":[[[120023,41045],[121616,39981],[122102,42307]]]},"properties":{"cp":[114.502461,38.045474],"name":"河北","childNum":3}},{"id":"140000","geometry":{"type":"Polygon","coordinates":["@@ħÜ_ªlìwGkÛÃǏokćiµVZģ¡coTSË¹ĪmnÕńehZg{gtwªpXaĚThȑp{¶Eh®RćƑP¿£PmcªaJyý{ýȥoÅîɡųAďä³aÏJ½¥PG­ąSM­sWz½µÛYÓŖgxoOkĒCo­Èµ]¯_²ÕjāK~©ÅØ^ÔkïçămÏk]­±cÝ¯ÑÃmQÍ~_apm~ç¡qu{JÅŧ·Ls}EyÁÆcI{¤IiCfUcƌÃp§]ě«vD@¡SÀµMÅwuYY¡DbÑc¡h×]nkoQdaMç~eDÛtT©±@¥ù@É¡ZcW|WqOJmĩl«ħşvOÓ«IqăV¥D[mI~Ó¢cehiÍ]Ɠ~ĥqX·eƷn±}v[ěďŕ]_œ`¹§ÕōIo©b­s^}Ét±ū«³p£ÿ¥WÑxçÁ«h×u×¥ř¾dÒ{ºvĴÎêÌɊ²¶ü¨|ÞƸµȲLLúÉƎ¤ϊęĔV`_bªS^|dzY|dz¥pZbÆ£¶ÒK}tĦÔņƠPYznÍvX¶Ěn ĠÔzý¦ª÷ÑĸÙUȌ¸dòÜJð´ìúNM¬XZ´¤ŊǸ_tldI{¦ƀðĠȤ¥NehXnYGR° ƬDj¬¸|CĞKqºfƐiĺ©ª~ĆOQª ¤@ìǦɌ²æBÊTĞHƘÁĪËĖĴŞȀÆÿȄlŤĒötÎ½î¼ĨXh|ªM¤ÐzÞĩÒSrao³"],"encodeOffsets":[[117016,41452]]},"properties":{"cp":[112.549248,37.857014],"name":"山西","childNum":1}},{"id":"150000","geometry":{"type":"MultiPolygon","coordinates":[["@@ǪƫÌÛMĂ[`ÕCn}¶Vcês¯PqFB|S³C|kñHdiÄ¥sŉÅPóÑÑE^ÅPpy_YtShQ·aHwsOnŉÃs©iqjUSiº]ïW«gW¡ARëśĳĘů`çõh]y»ǃǛҤxÒm~zf}pf|ÜroÈzrKÈĵSƧż؜Ġu~è¬vîS¼ĂhĖMÈÄw\\fŦ°W ¢¾luŸDw\\Ŗĝ","@@GVu»Aylßí¹ãe]Eāò³C¹ð¾²iÒAdkò^P²CǜңǄ z¼g^èöŰ_Ĳĕê}gÁnUI«m]jvV¼euhwqAaW_µj»çjioQR¹ēÃßt@r³[ÛlćË^ÍÉáGOUÛOB±XkÅ¹£k|e]olkVÍ¼ÕqtaÏõjgÁ£§U^RLËnX°ÇBz^~wfvypV ¯ƫĉ˭ȫƗŷɿÿĿƑ˃ĝÿÃǃßËőó©ǐȍŒĖM×ÍEyxþp]ÉvïèvƀnÂĴÖ@V~Ĉ³MEĸÅĖtējyÄDXÄxGQuv_i¦aBçw˛wD©{tāmQ{EJ§KPśƘƿ¥@sCTÉ}ɃwƇy±gÑ}T[÷kÐç¦«SÒ¥¸ëBX½HáÅµÀğtSÝÂa[ƣ°¯¦Pï¡]£ġÒk®G²èQ°óMq}EóƐÇ\\@áügQÍu¥FTÕ¿Jû]|mvāÎYua^WoÀa·­ząÒot×¶CLƗi¯¤mƎHǊ¤îìɾŊìTdåwsRÖgĒųúÍġäÕ}Q¶¿A[¡{d×uQAMxVvMOmăl«ct[wº_ÇÊjbÂ£ĦS_éQZ_lwgOiýe`YYJq¥IÁǳ£ÙË[ÕªuƏ³ÍTs·bÁĽäė[b[ŗfãcn¥îC¿÷µ[ŏÀQ­ōĉm¿Á^£mJVmL[{Ï_£F¥Ö{ŹA}×Wu©ÅaųĳƳhB{·TQqÙIķËZđ©Yc|M¡LeVUóK_QWk_ĥ¿ãZ»X\\ĴuUèlG®ěłTĠğDŃGÆÍz]±ŭ©Å]ÅÐ}UË¥©TċïxgckfWgi\\ÏĒ¥HkµEë{»ÏetcG±ahUiñiWsɁ·cCÕk]wȑ|ća}wVaĚá G°ùnM¬¯{ÈÐÆA¥ÄêJxÙ¢hP¢ÛºµwWOóFÁz^ÀŗÎú´§¢T¤ǻƺSėǵhÝÅQgvBHouʝl_o¿Ga{ïq{¥|ſĿHĂ÷aĝÇqZñiñC³ª»E`¨åXēÕqÉû[l}ç@čƘóO¿¡FUsAʽīccocÇS}£IS~ălkĩXçmĈŀÐoÐdxÒuL^T{r@¢ÍĝKén£kQyÅõËXŷƏL§~}kq»IHėǅjĝ»ÑÞoå°qTt|r©ÏS¯·eŨĕx«È[eM¿yupN~¹ÏyN£{©għWí»Í¾səšǅ_ÃĀɗ±ąĳĉʍŌŷSÉA±åǥɋ@ë£R©ąP©}ĹªƏj¹erLDĝ·{i«ƫC½ÉshVzGS|úþXgp{ÁX¿ć{ƱȏñZáĔyoÁhA}ŅĆfdŉ_¹Y°ėǩÑ¡H¯¶oMQqð¡Ë|Ñ`ƭŁX½·óÛxğįÅcQs«tȋǅFù^it«Č¯[hAi©á¥ÇĚ×l|¹y¯Kȝqgů{ñǙµïċĹzŚȭ¶¡oŽäÕG\\ÄT¿Òõr¯LguÏYęRƩɷŌO\\İÐ¢æ^Ŋ ĲȶȆbÜGĝ¬¿ĚVĎgª^íu½jÿĕęjık@Ľ]ėl¥ËĭûÁėéV©±ćn©­ȇÍq¯½YÃÔŉÉNÑÅÝy¹NqáʅDǡËñ­ƁYÅy̱os§ȋµʽǘǏƬɱàưN¢ƔÊuľýľώȪƺɂļxZĈ}ÌŉŪĺœĭFЛĽ̅ȣͽÒŵìƩÇϋÿȮǡŏçƑůĕ~Ç¼ȳÐUfdIxÿ\\G zâɏÙOº·pqy£@qþ@Ǟ˽IBäƣzsÂZÁàĻdñ°ŕzéØűzșCìDȐĴĺf®Àľưø@ɜÖÞKĊŇƄ§͑těï͡VAġÑÑ»d³öǍÝXĉĕÖ{þĉu¸ËʅğU̎éhɹƆ̗̮ȘǊ֥ड़ࡰţાíϲäʮW¬®ҌeרūȠkɬɻ̼ãüfƠSצɩςåȈHϚÎKǳͲOðÏȆƘ¼CϚǚ࢚˼ФÔ¤ƌĞ̪Qʤ´¼mȠJˀƲÀɠmɆǄĜƠ´ǠN~ʢĜ¶ƌĆĘźʆȬ˪ĚĒ¸ĞGȖƴƀj`ĢçĶāàŃºēĢĖćYÀŎüôQÐÂŎŞǆŞêƖoˆDĤÕºÑǘÛˤ³̀gńƘĔÀ^ªƂ`ªt¾äƚêĦĀ¼ÐĔǎ¨Ȕ»͠^ˮÊȦƤøxRrŜH¤¸ÂxDÄ|ø˂˜ƮÐ¬ɚwɲFjĔ²Äw°ǆdÀÉ_ĸdîàŎjÊêTĞªŌŜWÈ|tqĢUB~´°ÎFCU¼pĀēƄN¦¾O¶łKĊOjĚj´ĜYp{¦SĚÍ\\T×ªV÷Ší¨ÅDK°ßtŇĔK¨ǵÂcḷ̌ĚǣȄĽFlġUĵŇȣFʉɁMğįʏƶɷØŭOǽ«ƽū¹Ʊő̝Ȩ§ȞʘĖiɜɶʦ}¨֪ࠜ̀ƇǬ¹ǨE˦ĥªÔêFxúQEr´Wrh¤Ɛ \\talĈDJÜ|[Pll̚¸ƎGú´P¬W¦^¦H]prRn|or¾wLVnÇIujkmon£cX^Bh`¥V¦U¤¸}xRj[^xN[~ªxQ[`ªHÆÂExx^wN¶Ê|¨ìMrdYpoRzNyÀDs~bcfÌ`L¾n|¾T°c¨È¢ar¤`[|òDŞĔöxElÖdHÀI`Ď\\Àì~ÆR¼tf¦^¢ķ¶eÐÚMptgjɡČÅyġLûŇV®ÄÈƀĎ°P|ªVVªj¬ĚÒêp¬E|ŬÂ_~¼rƐK f{ĘFĒƌXưăkÃĄ}nµo×q£ç­kX{uĩ«āíÓUŅÝVUŌ]Ť¥lyň[oi{¦LĸĦ^ôâJ¨^UZðÚĒL¿Ìf£K£ʺoqNwğc`uetOj×°KJ±qÆġmĚŗos¬qehqsuH{¸kH¡ÊRǪÇƌbȆ¢´äÜ¢NìÉʖ¦â©Ɨؗ"]],"encodeOffsets":[[[128500,52752],[127089,51784]]]},"properties":{"cp":[111.670801,40.818311],"name":"内蒙古","childNum":2}},{"id":"210000","geometry":{"type":"MultiPolygon","coordinates":[["@@L@@s]","@@MnNm","@@dc","@@eÀC@b","@@fXwkbrÄ`qg","@@^jtWQ","@@~ Y[c","@@I`ĖN^_¿ZÁM","@@Ïxǌ{q_×^Gigp","@@iX¶BY","@@YZ","@@L_yG`b","@@^WqCTZ","@@\\[§t|]","@@m`p[","@@@é^BntaÊU]x ¯ÄPĲ­°hʙK³VÕ@Y~|EvĹsÇ¦­L^pÃ²ŸÒG Ël]xxÄ_fT¤Ď¤cPC¨¸TVjbgH²sdÎdHt`B²¬GJję¶[ÐhjeXdlwhðSČ¦ªVÊÏÆZÆŶ®²^ÎyÅHńĚDMħĜŁH­kçvV[ĳ¼WYÀäĦ`XlR`ôLUVfK¢{NZdĒªYĸÌÚJRr¸SA|ƴgŴĴÆbvªØX~źB|¦ÕE¤Ð`\\|KUnnI]¤ÀÂĊnŎR®Ő¿¶\\ÀøíDm¦ÎbŨabaĘ\\ľãÂ¸atÎSƐ´©v\\ÖÚÌǴ¤Â¨JKrZ_ZfjþhPkx`YRIjJcVf~sCN¤ EhæmsHy¨SðÑÌ\\\\ĐRÊwS¥fqŒßýáĞÙÉÖ[^¯ǤŲê´\\¦¬ĆPM¯£»uïpùzExanµyoluqe¦W^£ÊL}ñrkqWňûPUP¡ôJoo·U}£[·¨@XĸDXm­ÛÝºGUCÁª½{íĂ^cjk¶Ã[q¤LÉö³cux«|Zd²BWÇ®Yß½ve±ÃCý£W{Ú^q^sÑ·¨ËMr¹·C¥GDrí@wÕKţÃ«V·i}xËÍ÷i©ĝɝǡ]{c±OW³Ya±_ç©HĕoƫŇqr³Lys[ñ³¯OSďOMisZ±ÅFC¥Pq{Ã[Pg}\\¿ghćOk^ĩÃXaĕËĥM­oEqqZûěŉ³F¦oĵhÕP{¯~TÍlªNßYÐ{Ps{ÃVUeĎwk±ŉVÓ½ŽJãÇÇ»Jm°dhcÀffdF~ĀeĖd`sx² ®EĦ¦dQÂd^~ăÔH¦\\LKpĄVez¤NP ǹÓRÆąJSh­a[¦´ÂghwmBÐ¨źhI|VV|p] Â¼èNä¶ÜBÖ¼L`¼bØæKVpoúNZÞÒKxpw|ÊEMnzEQIZZNBčÚFÜçmĩWĪñtÞĵÇñZ«uD±|ƏlǗw·±PmÍada CLǑkùó¡³Ï«QaċÏOÃ¥ÕđQȥċƭy³ÁA"]],"encodeOffsets":[[[123686,41445],[126019,40435],[124393,40128],[126117,39963],[125322,40140],[126686,40700],[126041,40374],[125584,40168],[125509,40217],[125453,40165],[125362,40214],[125280,40291],[125774,39997],[125976,40496],[125822,39993],[122731,40949]]]},"properties":{"cp":[123.429096,41.796767],"name":"辽宁","childNum":16}},{"id":"220000","geometry":{"type":"Polygon","coordinates":["@@ñr½ÉKāGÁ¤ia ÉÈ¹`\\xs¬dĆkNnuNUwNx¶c¸|\\¢GªóĄ~RãÖÎĢùđŴÕhQxtcæëSɽŉíëǉ£ƍG£nj°KƘµDsØÑpyĆ¸®¿bXp]vbÍZuĂ{n^IüÀSÖ¦EvRÎûh@â[ƏÈô~FNr¯ôçR±­HÑlĢ^¤¢OðætxsŒ]ÞÁTĠs¶¿âÆGW¾ìA¦·TÑ¬è¥ÏÐJ¨¼ÒÖ¼ƦɄxÊ~StD@Ă¼Ŵ¡jlºWvÐzƦZÐ²CH AxiukdGgetqmcÛ£Ozy¥cE}|¾cZk¿uŐã[oxGikfeäT@SUwpiÚFM©£è^Ú`@v¶eňf heP¶täOlÃUgÞzŸU`l}ÔÆUvØ_Ō¬Öi^ĉi§²ÃB~¡ĈÚEgc|DC_Ȧm²rBx¼MÔ¦ŮdĨÃâYxƘDVÇĺĿg¿cwÅ\\¹¥Yĭl¤OvLjM_a W`zļMž·\\swqÝSAqŚĳ¯°kRē°wx^ĐkǂÒ\\]nrĂ}²ĊŲÒøãh·M{yMzysěnĒġV·°G³¼XÀ¤¹i´o¤ŃÈ`ÌǲÄUĞd\\iÖmÈBĤÜɲDEh LG¾ƀÄ¾{WaYÍÈĢĘÔRîĐj}ÇccjoUb½{h§Ǿ{KƖµÎ÷GĄØŜçưÌs«lyiē«`å§H¥Ae^§GK}iã\\c]v©ģZmÃ|[M}ģTɟĵÂÂ`ÀçmFK¥ÚíÁbX³ÌQÒHof{]ept·GŋĜYünĎųVY^ydõkÅZW«WUa~U·SbwGçǑiW^qFuNĝ·EwUtW·Ýďæ©PuqEzwAVXRãQ`­©GYYhcUGorBd}ģÉb¡·µMicF«Yƅ»é\\ɹ~ǙG³mØ©BšuT§Ĥ½¢Ã_Ã½L¡ûsT\\rke\\PnwAKy}ywdSefµ]UhĿD@mÿvaÙNSkCuncÿ`lWėVâ¦÷~^fÏ~vwHCį`xqT­­lW«ï¸skmßEGqd¯R©Ý¯¯S\\cZ¹iűƏCuƍÓXoR}M^o£R}oªU­FuuXHlEÅÏ©¤ßgXþ¤D²ÄufàÀ­XXÈ±Ac{Yw¬dvõ´KÊ£\\rµÄlidā]|î©¾DÂVH¹Þ®ÜWnCķ W§@\\¸~¤Vp¸póIO¢VOŇürXql~òÉK]¤¥Xrfkvzpm¶bwyFoúvð¼¤ N°ąO¥«³[éǣű]°Õ\\ÚÊĝôîŇÔaâBYlďQ[ Ë[ïÒ¥RI|`j]P"],"encodeOffsets":[[126831,44503]]},"properties":{"cp":[125.3245,43.886841],"name":"吉林","childNum":1}},{"id":"230000","geometry":{"type":"MultiPolygon","coordinates":[["@@UµNÿ¥īèçHÍøƕ¶Lǽ|g¨|a¾pVidd~ÈiíďÓQġėÇZÎXb½|ſÃH½KFgɱCģÛÇAnjÕc[VĝǱÃËÇ_ £ń³pj£º¿»WH´¯U¸đĢmtĜyzzNN|g¸÷äűÑ±ĉā~mq^[ǁÑďlw]¯xQĔ¯l°řĴrBÞTxr[tŽ¸ĻN_yX`biNKuP£kZĮ¦[ºxÆÀdhĹŀUÈƗCwáZħÄŭcÓ¥»NAw±qȥnD`{ChdÙFć}¢A±Äj¨]ĊÕjŋ«×`VuÓÅ~_kŷVÝyhVkÄãPsOµfgeŇµf@u_Ù ÙcªNªÙEojVxT@ãSefjlwH\\pŏäÀvlY½d{F~¦dyz¤PÜndsrhfHcvlwjF£G±DÏƥYyÏu¹XikĿ¦ÏqƗǀOŜ¨LI|FRĂn sª|C˜zxAè¥bfudTrFWÁ¹Am|ĔĕsķÆF´N}ćUÕ@Áĳſmuçuð^ÊýowFzØÎĕNőǏȎôªÌŒǄàĀÄ˄ĞŀƒʀĀƘŸˮȬƬĊ°Uzouxe]}AyÈW¯ÌmKQ]Īºif¸ÄX|sZt|½ÚUÎ lk^p{f¤lºlÆW A²PVÜPHÊâ]ÎĈÌÜk´\\@qàsĔÄQºpRij¼èi`¶bXrBgxfv»uUi^v~J¬mVp´£´VWrnP½ì¢BX¬hðX¹^TjVriªjtŊÄmtPGx¸bgRsT`ZozÆO]ÒFôÒOÆŊvÅpcGêsx´DR{AEOr°x|íb³Wm~DVjºéNNËÜ˛ɶ­GxŷCSt}]ûōSmtuÇÃĕNāg»íT«u}ç½BĵÞʣ¥ëÊ¡MÛ³ãȅ¡ƋaǩÈÉQG¢·lG|tvgrrf«ptęŘnÅĢrI²¯LiØsPf_vĠdxM prʹL¤¤eËÀđKïÙVY§]Ióáĥ]ķK¥j|pŇ\\kzţ¦šnņäÔVĂîĪ¬|vW®l¤èØrxm¶ă~lÄƯĄ̈́öȄEÔ¤ØQĄĄ»ƢjȦOǺ¨ìSŖÆƬyQv`cwZSÌ®ü±Ǆ]ŀç¬B¬©ńzƺŷɄeeOĨSfm ĊƀP̎ēz©ĊÄÕÊmgÇsJ¥ƔŊśæÎÑqv¿íUOµªÂnĦÁ_½ä@êí£P}Ġ[@gġ}gɊ×ûÏWXá¢užƻÌsNÍ½ƎÁ§čŐAēeL³àydl¦ĘVçŁpśǆĽĺſÊQíÜçÛġÔsĕ¬Ǹ¯YßċġHµ ¡eå`ļrĉŘóƢFìĎWøxÊkƈdƬv|I|·©NqńRŀ¤éeŊŀàŀU²ŕƀBQ£Ď}L¹Îk@©ĈuǰųǨÚ§ƈnTËÇéƟÊcfčŤ^XmHĊĕË«W·ċëx³ǔķÐċJāwİ_ĸȀ^ôWr­°oú¬ĦŨK~ȰCĐ´Ƕ£fNÎèâw¢XnŮeÂÆĶ¾¾xäLĴĘlļO¤ÒĨA¢Êɚ¨®ØCÔ ŬGƠƦYĜĘÜƬDJg_ͥœ@čŅĻA¶¯@wÎqC½Ĉ»NăëKďÍQÙƫ[«ÃígßÔÇOÝáWñuZ¯ĥŕā¡ÑķJu¤E å¯°WKÉ±_d_}}vyõu¬ï¹ÓU±½@gÏ¿rÃ½DgCdµ°MFYxw¿CG£Rƛ½Õ{]L§{qqą¿BÇƻğëܭǊË|c²}Fµ}ÙRsÓpg±QNqǫŋRwŕnéÑÉK«SeYRŋ@{¤SJ}D Ûǖ֍]gr¡µŷjqWÛham³~S«Ü[","@@ƨĶTLÇyqpÇÛqe{~oyen}s`qiXGù]Ëp½©lÉÁp]Þñ´FĂ^fäîºkàz¼BUv¬D"]],"encodeOffsets":[[[134456,44547],[127123,51780]]]},"properties":{"cp":[126.642464,45.756967],"name":"黑龙江","childNum":2}},{"id":"320000","geometry":{"type":"Polygon","coordinates":["@@Õg^vÁbnÀ`Jnĝ¬òM¶ĘTÖŒbe¦¦{¸ZâćNp©Hp|`mjhSEb\\afv`sz^lkljÄtg¤D­¾X¿À|ĐiZȀåB·î}GL¢õcßjayBFµÏC^ĭcÙt¿sğH]j{s©HM¢QnDÀ©DaÜÞ·jgàiDbPufjDk`dPOîhw¡ĥ¥GP²ĐobºrYî¶aHŢ´ ]´rılw³r_{£DB_Ûdåuk|Ũ¯F Cºyr{XFye³Þċ¿ÂkĭB¿MvÛpm`rÚã@Ę¹hågËÖƿxnlč¶Åì½Ot¾dJlVJĂǀŞqvnO^JZż·Q}êÍÅmµÒ]ƍ¦Dq}¬R^èĂ´ŀĻĊIÔtĲyQŐĠMNtR®òLhĚs©»}OÓGZz¶A\\jĨFäOĤHYJvÞHNiÜaĎÉnFQlNM¤B´ĄNöɂtpŬdZÅglmuÇUšŞÚb¤uŃJŴu»¹ĄlȖħŴw̌ŵ²ǹǠ͛hĭłƕrçü±Yrřl¥i`ã__¢ćSÅr[Çq^ùzWmOĈaŐÝɞï²ʯʊáĘĳĒǭPħ͍ôƋÄÄÍīçÛɈǥ£­ÛmY`ó£Z«§°Ó³QafusNıǅ_k}¢m[ÝóDµ¡RLčiXyÅNïă¡¸iĔÏNÌķoıdōîåŤûHcs}~Ûwbù¹£¦ÓCtOPrE^ÒogĉIµÛÅʹK¤½phMú`mR¸¦PƚgÉLRs`£¯ãhD¨|³¤C"],"encodeOffsets":[[121451,32518]]},"properties":{"cp":[118.767413,32.041544],"name":"江苏","childNum":1}},{"id":"330000","geometry":{"type":"MultiPolygon","coordinates":[["@@jX^n","@@sfdM","@@qP\\xz[_i","@@o\\VzRZ}mECy","@@R¢FX}°[m]","@@Cb\\}","@@e|v\\laus","@@v~s{","@@QxÂF©}","@@¹nvÞs©m","@@rQgYIh","@@bi«ZX","@@p[}ILd","@@À¿|","@@¹dnb","@@rS}[Kl","@@g~h}","@@FlCk","@@ůTG°ĄLHm°UF","@@OdRe","@@v[u\\","@@FjâL~wyoo~sµLZ","@@¬e¹aH","@@\\nÔ¡q]L³ë\\ÿ®QÌ","@@ÊA­©]ª","@@Kxv{­","@@@hlIk_","@@pWcrxp","@@Md|_iA","@@¢X£½z\\ðpN","@@hlÜ[LykAvyfw^E ","@@fp¤MusH","@@®_ma~LÁ¬`","@@@°¡mÛGĕ¨§Ianá[ýƤjfæÐNäGp","@@iMt\\","@@Zc[b","@@X®±GrÆ°Zæĉm","@@Z~dOSo|A¿qZv","@@@`EN£p","@@|s","@@@nDi","@@na£¾uYL¯QªmĉÅdMgÇjcº«ę¬­K­´B«Âącoċ\\xK`cįŧ«®á[~ıxu·ÅKsËÉc¢Ù\\ĭƛëbf¹­ģSĜkáƉÔ­ĈZB{aMµfzŉfÓÔŹŁƋǝÊĉ{ğč±g³ne{ç­ií´S¬\\ßðK¦w\\iqªĭiAuA­µ_W¥ƣO\\lċĢttC¨£t`PZäuXßBsĻyekOđġĵHuXBµ]×­­\\°®¬F¢¾pµ¼kŘó¬Wät¸|@L¨¸µrºù³Ù~§WIZW®±Ð¨ÒÉx`²pĜrOògtÁZ{üÙ[|ûKwsPlU[}¦Rvn`hsª^nQ´ĘRWb_ rtČFIÖkĦPJ¶ÖÀÖJĈĄTĚòC ²@PúØz©Pî¢£CÈÚĒ±hŖl¬â~nm¨f©iļ«mntqÒTÜÄjL®EÌFª²iÊxØ¨IÈhhst[Ôx}dtüGæţŔïĬaĸpMËÐjē¢·ðĄÆMzjWKĎ¢Q¶À_ê_@ıi«pZgf¤Nrq]§ĂN®«H±yƳí¾×ŊďŀĐÏŴǝĂíÀBŖÕªÁŐTFqĉ¯³ËCĕģi¨hÜ·ñt»¯Ï","@@ºwZRkĕWK "]],"encodeOffsets":[[[125785,31436],[125729,31431],[125513,31380],[125329,30690],[125223,30438],[125115,30114],[124815,29155],[124419,28746],[124095,28635],[124005,28609],[125000,30713],[125111,30698],[125078,30682],[125150,30684],[124014,28103],[125008,31331],[125411,31468],[125329,31479],[125369,31139],[125626,30916],[125417,30956],[125254,30976],[125199,30997],[125095,31058],[125083,30915],[124885,31015],[125218,30798],[124867,30838],[124755,30788],[124802,30809],[125267,30657],[125218,30578],[125200,30562],[125192,30787],[124968,30474],[125167,30396],[125115,30363],[124955,29879],[124714,29781],[124762,29462],[124325,28754],[124863,30077],[125366,31477]]]},"properties":{"cp":[120.153576,30.287459],"name":"浙江","childNum":43}},{"id":"340000","geometry":{"type":"MultiPolygon","coordinates":[["@@^iuLV\\","@@e©Edh","@@´CE¶zAXêeödK¡~H¸íæAȽd{ďÅÀ½W®£ChÃsikkly]_teu[bFaTign{]GqªoĈMYá|·¥f¥őaSÕėNµñĞ«Im_m¿Âa]uĜp Z_§{Cäg¤°r[_YjÆOdý[I[á·¥Q_nùgL¾mzˆDÜÆ¶ĊJhpc¹O]iŠ]¥ jtsggDÑ¡w×jÉ©±EFË­KiÛÃÕYvsm¬njĻª§emná}k«ŕgđ²ÙDÇ¤í¡ªOy×Où±@DñSęćăÕIÕ¿IµĥOlJÕÍRÍ|JìĻÒåyķrĕq§ÄĩsWÆßF¶X®¿mwRIÞfßoG³¾©uyHį{Ɓħ¯AFnuPÍÔzVdàôº^Ðæd´oG¤{S¬ćxã}ŧ×Kǥĩ«ÕOEÐ·ÖdÖsƘÑ¨[Û^Xr¢¼§xvÄÆµ`K§ tÒ´Cvlo¸fzŨð¾NY´ı~ÉĔēßúLÃÃ_ÈÏ|]ÂÏHlg`ben¾¢pUh~ƴĖ¶_r sĄ~cƈ]|r c~`¼{À{ȒiJjz`îÀT¥Û³]u}fïQl{skloNdjäËzDvčoQďHI¦rbrHĖ~BmlNRaĥTX\\{fÁKÁ®TLÂÄMtÊgĀDĄXƔvDcÎJbt[¤D@®hh~kt°ǾzÖ@¾ªdbYhüóV´ŮŒ¨Üc±r@J|àuYÇÔG·ĚąĐlŪÚpSJ¨ĸLvÞcPæķŨ®mÐálsgd×mQ¨ųÆ©Þ¤IÎs°KZpĄ|XwWdĎµmkǀwÌÕæhºgBĝâqÙĊzÖgņtÀÁĂÆáhEz|WzqD¹°Eŧl{ævÜcA`¤C`|´qxĲkq^³³GšµbíZ¹qpa±ď OH¦Ħx¢gPícOl_iCveaOjChß¸iÝbÛªCC¿mRV§¢A|tbkĜEÀtîm^g´fÄ"]],"encodeOffsets":[[[121722,32278],[119475,30423],[121606,33646]]]},"properties":{"cp":[117.283042,31.86119],"name":"安徽","childNum":3}},{"id":"350000","geometry":{"type":"MultiPolygon","coordinates":[["@@zht´}[","@@aj^~ĆGå","@@edHse","@@@vPGsyQ","@@sBzddW[O","@@S¨Qy","@@NVucW","@@qptB@q","@@¸[iu","@@Q\\pD[_","@@jSwUappI","@@eXª~","@@AjvFoo","@@fT_Çí\\v|ba¦jZÆy|®","@@IjLg","@@wJIx«¼AoNe{M¥","@@K±¡ÓČ~N¾","@@k¡¹Eh~c®uDqZì¡I~Māe£bN¨gZý¡a±Öcp©PhI¢QqÇGj|¥U g[Ky¬ŏv@OptÉEF\\@ åA¬V{XģĐBycpě¼³Ăp·¤¥ohqqÚ¡ŅLs^Ã¡§qlÀhH¨MCe»åÇGD¥zPO£čÙkJA¼ßėuĕeûÒiÁŧS[¡Uûŗ½ùěcÝ§SùĩąSWó«íęACµeRåǃRCÒÇZÍ¢ź±^dlstjD¸ZpuÔâÃH¾oLUêÃÔjjēò´ĄWƛ^Ñ¥Ħ@ÇòmOw¡õyJyD}¢ďÑÈġfZda©º²z£NjD°Ötj¶¬ZSÎ~¾c°¶ÐmxO¸¢Pl´SL|¥AȪĖMņĲg®áIJČĒü` QF¬h|ĂJ@zµ |ê³È ¸UÖŬŬÀCtrĸr]ðM¤ĶĲHtÏ AĬkvsq^aÎbvdfÊòSD´Z^xPsĂrvƞŀjJd×ŘÉ ®AÎ¦ĤdxĆqAZRÀMźnĊ»İÐZ YXæJyĊ²·¶q§·K@·{sXãô«lŗ¶»o½E¡­«¢±¨Y®Ø¶^AvWĶGĒĢPlzfļtàAvWYãO_¤sD§ssČġ[kƤPX¦`¶®BBvĪjv©jx[L¥àï[F¼ÍË»ğV`«Ip}ccÅĥZEãoP´B@D¸m±z«Ƴ¿å³BRØ¶Wlâþäą`]Z£Tc ĹGµ¶Hm@_©k¾xĨôȉðX«½đCIbćqK³ÁÄš¬OAwã»aLŉËĥW[ÂGIÂNxĳ¤D¢îĎÎB§°_JGs¥E@¤ućPåcuMuw¢BI¿]zG¹guĮI"]],"encodeOffsets":[[[123250,27563],[122541,27268],[123020,27189],[122916,27125],[122887,26845],[122808,26762],[122568,25912],[122778,26197],[122515,26757],[122816,26587],[123388,27005],[122450,26243],[122578,25962],[121255,25103],[120987,24903],[122339,25802],[121042,25093],[122439,26024]]]},"properties":{"cp":[119.306239,26.075302],"name":"福建","childNum":18}},{"id":"360000","geometry":{"type":"Polygon","coordinates":["@@ÖP¬ǦĪØLŨä~Ĉw«|TH£pc³Ïå¹]ĉđxe{ÎÓvOEm°BƂĨİ|Gvz½ª´HàpeJÝQxnÀW­EµàXÅĪt¨ÃĖrÄwÀFÎ|Ă¡WÕ¸cf¥XaęST±m[r«_gmQu~¥V\\OkxtL E¢Ú^~ýØkbēqoě±_Êw§Ñ²ÏƟė¼mĉŹ¿NQYBąrwģcÍ¥B­ŗÊcØiIƝĿuqtāwO]³YCñTeÉcaubÍ]trluīBÐGsĵıN£ï^ķqsq¿DūūVÕ·´Ç{éĈýÿOER_đûIċâJh­ŅıNȩĕB¦K{Tk³¡OP·wnµÏd¯}½TÍ«YiµÕsC¯iM¤­¦¯P|ÿUHvhe¥oFTuõ\\OSsMòđƇiaºćXĊĵà·çhƃ÷Ç{ígu^đgm[ÙxiIN¶Õ»lđÕwZSÆv©_ÈëJbVkĔVÀ¤P¾ºÈMÖxlò~ªÚàGĂ¢B±ÌKyñ`w²¹·`gsÙfIěxŕeykpudjuTfb·hh¿Jd[\\LáƔĨƐAĈepÀÂMD~ņªe^\\^§ý©j×cZØ¨zdÒa¶lÒJìõ`oz÷@¤uŞ¸´ôęöY¼HČƶajlÞƩ¥éZ[|h}^U  ¥pĄžƦO lt¸Æ Q\\aÆ|CnÂOjt­ĚĤdÈF`¶@Ðë ¦ōÒ¨SêvHĢÛ@[ÆQoxHW[ŰîÀt¦Ǆ~NĠ¢lĄtZoCƞÔºCxrpČNpj¢{f_Y`_eq®Aot`@oDXfkp¨|s¬\\DÄSfè©Hn¬^DhÆyøJhØxĢĀLÊƠPżċĄwĮ¶"],"encodeOffsets":[[118923,30536]]},"properties":{"cp":[115.892151,28.676493],"name":"江西","childNum":1}},{"id":"370000","geometry":{"type":"MultiPolygon","coordinates":[["@@Xjd]mE","@@itnq","@@Dl@k","@@TGw","@@K¬U","@@Wd`c","@@PtMs","@@LnXlc","@@ppVu]Qn","@@cdzAU_","@@udRhnCE","@@oIpP","@@M{ĿčwbxƨîKÎMĮ]ZF½Y]â£ph¶¨râøÀÎǨ¤^ºÄGz~grĚĜlĞÆLĆǆ¢Îo¦cvKbgr°WhmZp L]LºcUÆ­nżĤÌĒbAnrOA´ȊcÀbƦUØrĆUÜøĬƞŶǬĴóò_A̈«ªdÎÉnb²ĦhņBĖįĦåXćì@L¯´ywƕCéÃµė ƿ¸lµZæyj|BíÂKNNnoƈfÈMZwnŐNàúÄsTJULîVjǎ¾ĒØDz²XPn±ŴPè¸ŔLƔÜƺ_TüÃĤBBċÈöA´faM¨{«M`¶d¡ôÖ°mȰBÔjj´PM|c^d¤u¤Û´ä«ƢfPk¶Môl]Lb}su^ke{lCMrDÇ­]NÑFsmoõľHyGă{{çrnÓEƕZGª¹Fj¢ÿ©}ÌCǷë¡ąuhÛ¡^KxC`C\\bÅxì²ĝÝ¿_NīCȽĿåB¥¢·IŖÕy\\¹kxÃ£ČáKµË¤ÁçFQ¡KtŵƋ]CgÏAùSedcÚźuYfyMmhUWpSyGwMPqŀÁ¼zK¶G­Y§Ë@´śÇµƕBm@IogZ¯uTMx}CVKï{éƵP_K«pÛÙqċtkkù]gTğwoɁsMõ³ăAN£MRkmEÊčÛbMjÝGuIZGPģãħE[iµBEuDPÔ~ª¼ęt]ûG§¡QMsğNPŏįzs£Ug{đJĿļā³]ç«Qr~¥CƎÑ^n¶ÆéÎR~Ż¸YI] PumŝrƿIā[xeÇ³L¯v¯s¬ÁY~}ťuŁgƋpÝĄ_ņī¶ÏSR´ÁP~¿Cyċßdwk´SsX|t`Ä ÈðAªìÎT°¦Dda^lĎDĶÚY°`ĪŴǒàŠv\\ebZHŖR¬ŢƱùęOÑM­³FÛaj"]],"encodeOffsets":[[[123806,39303],[123821,39266],[123742,39256],[123702,39203],[123649,39066],[123847,38933],[123580,38839],[123894,37288],[123043,36624],[123344,38676],[123522,38857],[123628,38858],[118267,36772]]]},"properties":{"cp":[117.000923,36.675807],"name":"山东","childNum":13}},{"id":"410000","geometry":{"type":"MultiPolygon","coordinates":[["@@dXD}~Hgq~ÔN~zkĘHVsǲßjŬŢ`Pûàl¢\\ÀEhİgÞē X¼`khÍLùµP³swIÓzeŠĠð´E®ÚPtºIŊÊºL«šŕQGYfa[şußǑĩų_Z¯ĵÙčC]kbc¥CS¯ëÍB©ïÇÃ_{sWTt³xlàcČzÀD}ÂOQ³ÐTĬµƑÐ¿ŸghłŦv~}ÂZ«¤lPÇ£ªÝŴÅR§ØnhctâknÏ­ľŹUÓÝdKuķI§oTũÙďkęĆH¸Ó\\Ä¿PcnS{wBIvÉĽ[GqµuŇôYgûZca©@½Õǽys¯}lgg@­C\\£asIdÍuCQñ[L±ęk·ţb¨©kK»KC²òGKmĨS`UQnk}AGēsqaJ¥ĐGRĎpCuÌy ã iMcplk|tRkðev~^´¦ÜSí¿_iyjI|ȑ|¿_»d}q^{Ƈdă}tqµ`ŷé£©V¡om½ZÙÏÁRD|JOÈpÀRsI{ùÓjuµ{t}uËRivGçJFjµåkWê´MÂHewixGw½Yŷpµú³XU½ġyłåkÚwZX·l¢Á¢KzOÎÎjc¼htoDHr|­J½}JZ_¯iPq{tę½ĕ¦Zpĵø«kQĹ¤]MÛfaQpě±ǽ¾]u­Fu÷nčÄ¯ADp}AjmcEÇaª³o³ÆÍSƇĈÙDIzçñİ^KNiÞñ[aA²zzÌ÷D|[íÄ³gfÕÞd®|`Ć~oĠƑô³ŊD×°¯CsøÂ«ìUMhTº¨¸ǝêWÔDruÂÇZ£ĆPZW~ØØv¬gèÂÒw¦X¤Ā´oŬ¬²Ês~]®tªapŎJ¨Öº_ŔfŐ\\Đ\\Ĝu~m²Ƹ¸fWĦrƔ}Î^gjdfÔ¡J}\\n C¦þWxªJRÔŠu¬ĨĨmFdM{\\d\\YÊ¢ú@@¦ª²SÜsC}fNècbpRmlØ^gd¢aÒ¢CZZxvÆ¶N¿¢T@uC¬^ĊðÄn|lIlXhun[","@@hzUq"]],"encodeOffsets":[[[116744,37216],[116480,33048]]]},"properties":{"cp":[113.665412,34.757975],"name":"河南","childNum":2}},{"id":"420000","geometry":{"type":"MultiPolygon","coordinates":[["@@ASd","@@ls{d","@@¾«}{ra®pîÃ\\{øCËyyB±b\\òÝjKL ]ĎĽÌJyÚCƈćÎT´Å´pb©ÈdFin~BCo°BĎÃømv®E^vǾ½Ĝ²RobÜeN^ĺ£R¬lĶ÷YoĖ¥Ě¾|sOr°jY`~I¾®I{GqpCgyl{£ÍÍyPLÂ¡¡¸kWxYlÙæŁĢz¾V´W¶ùŸo¾ZHxjwfxGNÁ³Xéæl¶EièIH ujÌQ~v|sv¶Ôi|ú¢FhQsğ¦SiŠBgÐE^ÁÐ{čnOÂÈUÎóĔÊēĲ}Z³½Mŧïeyp·uk³DsÑ¨L¶_ÅuÃ¨w»¡WqÜ]\\Ò§tƗcÕ¸ÕFÏǝĉăxŻČƟOKÉġÿ×wg÷IÅzCg]m«ªGeçÃTC«[t§{loWeC@ps_Bp­rf_``Z|ei¡oċMqow¹DƝÓDYpûsYkıǃ}s¥ç³[§cY§HK«Qy]¢wwö¸ïx¼ņ¾Xv®ÇÀµRĠÐHM±cÏdƒǍũȅȷ±DSyúĝ£ŤĀàtÖÿï[îb\\}pĭÉI±Ñy¿³x¯No|¹HÏÛmjúË~TuęjCöAwě¬Rđl¯ Ñb­ŇTĿ_[IčĄʿnM¦ğ\\É[T·k¹©oĕ@A¾wya¥Y\\¥Âaz¯ãÁ¡k¥ne£ÛwE©Êō¶˓uoj_U¡cF¹­[WvP©whuÕyBF`RqJUw\\i¡{jEPïÿ½fćQÑÀQ{°fLÔ~wXgītêÝ¾ĺHd³fJd]HJ²EoU¥HhwQsƐ»Xmg±çve]DmÍPoCc¾_hhøYrŊU¶eD°Č_N~øĹĚ·`z]Äþp¼äÌQv\\rCé¾TnkžŐÚÜa¼ÝƆĢ¶ÛodĔňÐ¢JqPb ¾|J¾fXƐîĨ_Z¯À}úƲN_ĒÄ^ĈaŐyp»CÇÄKñL³ġM²wrIÒŭxjb[n«øæà ^²­h¯ÚŐªÞ¸Y²ĒVø}Ā^İ´LÚm¥ÀJÞ{JVųÞŃx×sxxƈē ģMřÚðòIfĊŒ\\Ʈ±ŒdÊ§ĘDvČ_Àæ~Dċ´A®µ¨ØLV¦êHÒ¤"]],"encodeOffsets":[[[113712,34000],[115612,30507],[113649,34054]]]},"properties":{"cp":[114.298572,30.584355],"name":"湖北","childNum":3}},{"id":"430000","geometry":{"type":"MultiPolygon","coordinates":[["@@nFZw","@@ãÆá½ÔXrCOËRïÿĩ­TooQyÓ[ŅBE¬ÎÓXaį§Ã¸G °ITxpúxÚĳ¥ÏĢ¾edÄ©ĸGàGhM¤Â_U}Ċ}¢pczfþg¤ÇôAV","@@ȴÚĖÁĐiOĜ«BxDõĚivSÌ}iùÜnÐºG{p°M°yÂÒzJ²Ì ÂcXëöüiáÿñőĞ¤ùTz²CȆȸǎŪƑÐc°dPÎğË¶[È½u¯½WM¡­ÉB·rínZÒ `¨GA¾\\pēXhÃRC­üWGġuTé§ŎÑ©êLM³}_EÇģc®ęisÁPDmÅ{b[RÅs·kPŽƥóRoOV~]{g\\êYƪ¦kÝbiċƵGZ»Ěõó·³vŝ£ø@pyö_ëIkÑµbcÑ§y×dYØªiþUjŅ³C}ÁN»hĻħƏâƓKA·³CQ±µ§¿AUƑ¹AtćOwD]JUÖgk¯b£ylZFËÑ±H­}EbóľA¡»Ku¦·³åş¥ùBD^{ÌC´­¦ŷJ£^[ª¿ğ|ƅN skóā¹¿ï]ă~÷O§­@Vm¡Qđ¦¢Ĥ{ºjÔª¥nf´~Õo×ÛąGû¥cÑ[Z¶ŨĪ²SÊǔƐƀAÚŌ¦QØ¼rŭ­«}NÏürÊ¬mjr@ĘrTW ­SsdHzƓ^ÇÂyUi¯DÅYlŹu{hT}mĉ¹¥ěDÿë©ıÓ[Oº£¥ótł¹MÕƪ`PDiÛU¾ÅâìUñBÈ£ýhedy¡oċ`pfmjP~kZaZsÐd°wj§@Ĵ®w~^kÀÅKvNmX\\¨aŃqvíó¿F¤¡@ũÑVw}S@j}¾«pĂrªg àÀ²NJ¶¶DôK|^ª°LX¾ŴäPĪ±£EXd^¶ĲÞÜ~u¸ǔMRhsRe`ÄofIÔ\\Ø  ićymnú¨cj ¢»GČìƊÿÐ¨XeĈĀ¾Oð Fi ¢|[jVxrIQ_EzAN¦zLU`cªxOTu RLÄªpUĪȴ^ŎµªÉFxÜf¤ºgĲèy°Áb[¦Zb¦z½xBĖ@ªpºjS´rVźOd©ʪiĎăJP`"]],"encodeOffsets":[[[115640,30489],[112577,27316],[114113,30649]]]},"properties":{"cp":[112.982279,28.19409],"name":"湖南","childNum":3}},{"id":"440000","geometry":{"type":"MultiPolygon","coordinates":[["@@QdAsa","@@lxDRm","@@sbhNLo","@@Ă ý","@@WltOY[","@@Kr]S","@@e~AS}","@@I|Mym","@@Û³LS²Q","@@nvºBë¥cÕº","@@zdÛJm","@@°³","@@a yAª¸ËJIxØ@ĀHÉÕZofoo","@@sŗÃÔėAƁZÄ ~°ČPºb","@@¶ÝÌvmĞh¹Ĺ","@@HdSjĒ¢D}waru«ZqadY{K","@@el\\LqqO","@@~rMmX","@@f^E","@@øPªoj÷ÍÝħXČx°Q¨ıXJp","@@gÇƳmxatfu","@@EÆC½","@@¸B_¶ekWvSivc}p}Ăº¾NĎyj¦Èm th_®Ä}»âUzLË²Aā¡ßH©Ùñ}wkNÕ¹ÇO½¿£ēUlaUìIÇª`uTÅxYĒÖ¼kÖµMjJÚwn\\hĒv]îh|ÈƄøèg¸Ķß ĉĈWb¹ƀdéĘNTtP[öSvrCZaGubo´ŖÒÇĐ~¡zCIözx¢PnÈñ @ĥÒ¦]ƜX³ăĔñiiÄÓVépKG½ÄÓávYoC·sitiaÀyŧÎ¡ÈYDÑům}ý|m[węõĉZÅxUO}÷N¹³ĉo_qtăqwµŁYÙǝŕ¹tïÛUÃ¯mRCºĭ|µÕÊK½Rē ó]GªęAxNqSF|ām¡diď×YïYWªŉOeÚtĐ«zđ¹TāúEáÎÁWwíHcòßÎſ¿Çdğ·ùT×Çūʄ¡XgWÀǇğ·¿ÃOj YÇ÷Sğ³kzőõmĝ[³¡VÙæÅöMÌ³¹pÁaËýý©D©ÜJŹƕģGą¤{ÙūÇO²«BƱéAÒĥ¡«BhlmtÃPµyU¯ucd·w_bŝcīímGOGBȅŹãĻFŷŽŕ@Óoo¿ē±ß}}ÓF÷tĲWÈCőâUâǙIğŉ©IĳE×Á³AĥDĈ±ÌÜÓĨ£L]ĈÙƺZǾĆĖMĸĤfÎĵlŨnÈĐtFFĤêk¶^k°f¶g}®Faf`vXŲxl¦ÔÁ²¬Ð¦pqÊÌ²iXØRDÎ}Ä@ZĠsx®AR~®ETtĄZƈfŠŠHâÒÐAµ\\S¸^wĖkRzalŜ|E¨ÈNĀňZTpBh£\\ĎƀuXĖtKL¶G|»ĺEļĞ~ÜĢÛĊrOÙîvd]n¬VÊĜ°RÖpMƀ¬HbwEÀ©\\¤]ŸI®¥D³|Ë]CúAŠ¦æ´¥¸Lv¼¢ĽBaôF~®²GÌÒEYzk¤°ahlVÕI^CxĈPsBƒºVÀB¶¨R²´D","@@OR"]],"encodeOffsets":[[[117381,22988],[116552,22934],[116790,22617],[116973,22545],[116444,22536],[116931,22515],[116496,22490],[116453,22449],[113301,21439],[118726,21604],[118709,21486],[113210,20816],[115482,22082],[113171,21585],[113199,21590],[115232,22102],[115739,22373],[115134,22184],[113056,21175],[119573,21271],[119957,24020],[115859,22356],[116680,26053],[116561,22649]]]},"properties":{"cp":[113.280637,23.125178],"name":"广东","childNum":24}},{"id":"450000","geometry":{"type":"MultiPolygon","coordinates":[["@@H TI¡U","@@Ɣ_LÊFZgčP­kini«qÇczÍY®¬Ů»qR×ō©DÕ§ƙǃŵTÉĩ±ıdÑnYYĲvNĆĆØÜ Öp}e³¦m©iÓ|¹ħņ|ª¦QF¢Â¬ʖovg¿em^ucäāmÇÖåB¡Õçĝ}FĻ¼Ĺ{µHKsLSđƃrč¤[AgoSŇYMÿ§Ç{FśbkylQxĕ]T·¶[BÑÏGáşşƇeăYSs­FQ}­BwtYğÃ@~CÍQ ×WjË±rÉ¥oÏ ±«ÓÂ¥kwWűue_b­E~µh¯ecl¯Ïr¯EģJğ}w³Ƈē`ãògK_ÛsUʝćğ¶höO¤Ǜn³c`¡yię[ďĵűMę§]XÎ_íÛ]éÛUćİÕBƣ±dy¹T^dûÅÑŦ·PĻþÙ`K¦¢ÍeĥR¿³£[~äu¼dltW¸oRM¢ď\\z}Æzdvň{ÎXF¶°Â_ÒÂÏL©ÖTmu¼ãlīkiqéfA·Êµ\\őDc¥ÝFyÔćcűH_hLÜêĺĐ¨c}rn`½Ì@¸¶ªVLhŒ\\Ţĺk~Ġið°|gtTĭĸ^xvKVGréAébUuMJVÃO¡qĂXËSģãlýà_juYÛÒBG^éÖ¶§EGÅzěƯ¤EkN[kdåucé¬dnYpAyČ{`]þ±X\\ÞÈk¡ĬjàhÂƄ¢Hè ŔâªLĒ^Öm¶ħĊAǦė¸zÚGn£¾rªŀÜt¬@ÖÚSx~øOŒŶÐÂæȠ\\ÈÜObĖw^oÞLf¬°bI lTØBÌF£Ć¹gñĤaYt¿¤VSñK¸¤nM¼JE±½¸ñoÜCƆæĪ^ĚQÖ¦^f´QüÜÊz¯lzUĺš@ìp¶n]sxtx¶@~ÒĂJb©gk{°~c°`Ô¬rV\\la¼¤ôá`¯¹LCÆbxEræOv[H­[~|aB£ÖsºdAĐzNÂðsÞÆĤªbab`ho¡³F«èVZs\\\\ÔRzpp®SĪº¨ÖºNĳd`a¦¤F³¢@`¢ĨĀìhYvlĆº¦Ċ~nS|gźv^kGÆÀè·"]],"encodeOffsets":[[[111707,21520],[113706,26955]]]},"properties":{"cp":[108.320004,22.82402],"name":"广西","childNum":2}},{"id":"460000","geometry":{"type":"Polygon","coordinates":["@@¦Ŝil¢XƦƞòïè§ŞCêɕrŧůÇąĻõ·ĉ³œ̅kÇm@ċȧŧĥĽʉ­ƅſȓÒË¦ŝE}ºƑ[ÍĜȋ gÎfǐÏĤ¨êƺ\\Ɔ¸ĠĎvʄȀÐ¾jNðĀÒRZǆzÐĊ¢DÀɘZ"],"encodeOffsets":[[112750,20508]]},"properties":{"cp":[110.33119,20.031971],"name":"海南","childNum":1}},{"id":"510000","geometry":{"type":"MultiPolygon","coordinates":[["@@LqSn","@@ĆOìÛÐ@ĞǔNY{¤Á§di´ezÝúØãwIþËQÇ¦ÃqÉSJ»ĂéʔõÔƁİlƞ¹§ĬqtÀƄmÀêErĒtD®ċæcQE®³^ĭ¥©l}äQtoŖÜqÆkµªÔĻĴ¡@Ċ°B²Èw^^RsºTĀ£ŚæQPJvÄz^Đ¹Æ¯fLà´GC²dt­ĀRt¼¤ĦOðğfÔðDŨŁĞƘïPÈ®âbMüÀXZ ¸£@Å»»QÉ­]dsÖ×_Í_ÌêŮPrĔĐÕGĂeZÜîĘqBhtO ¤tE[h|YÔZśÎs´xº±Uñt|OĩĠºNbgþJy^dÂY Į]Řz¦gC³R`Āz¢Aj¸CL¤RÆ»@­Ŏk\\Ç´£YW}z@Z}Ã¶oû¶]´^NÒ}èNªPÍy¹`S°´ATeVamdUĐwʄvĮÕ\\uÆŗ¨Yp¹àZÂmWh{á}WØǍÉüwga§ßAYrÅÂQĀÕ¬LŐý®Xøxª½Ű¦¦[þ`ÜUÖ´òrÙŠ°²ÄkĳnDX{U~ET{ļº¦PZcjF²Ė@pg¨B{u¨ŦyhoÚD®¯¢ WòàFÎ¤¨GDäz¦kŮPġqË¥À]eâÚ´ªKxīPÖ|æ[xÃ¤JÞĥsNÖ½I¬nĨY´®ÐƐmDŝuäđđEbee_v¡}ìęǊē}qÉåT¯µRs¡M@}ůaa­¯wvƉåZw\\Z{åû`[±oiJDÅ¦]ĕãïrG réÏ·~ąSfy×Í·ºſƽĵȁŗūmHQ¡Y¡®ÁÃ×t«­T¤JJJyJÈ`Ohß¦¡uËhIyCjmÿwZGTiSsOB²fNmsPa{M{õE^Hj}gYpaeu¯oáwHjÁ½M¡pMuåmni{fk\\oÎqCwEZ¼KĝAy{m÷LwO×SimRI¯rKõBS«sFe]fµ¢óY_ÆPRcue°Cbo×bd£ŌIHgtrnyPt¦foaXďxlBowz_{ÊéWiêEGhÜ¸ºuFĈIxf®Y½ĀǙ]¤EyF²ċw¸¿@g¢§RGv»áW`ÃĵJwi]t¥wO­½a[×]`Ãi­üL¦LabbTÀåc}ÍhÆh®BHî|îºÉk­¤Sy£ia©taį·Ɖ`ō¥UhOĝLk}©Fos´JmµlŁuønÑJWÎªYÀïAetTŅÓGË«bo{ıwodƟ½OġÜÂµxàNÖ¾P²§HKv¾]|BÆåoZ`¡Ø`ÀmºĠ~ÌÐ§nÇ¿¤]wğ@srğu~Io[é±¹ ¿ſđÓ@qg¹zƱřaí°KtÇ¤V»Ã[ĩǭƑ^ÇÓ@áťsZÏÅĭƋěpwDóÖáŻneQËq·GCœýS]x·ýq³OÕ¶Qzßti{řáÍÇWŝŭñzÇWpç¿JXĩè½cFÂLiVjx}\\NŇĖ¥GeJA¼ÄHfÈu~¸Æ«dE³ÉMA|bÒćhG¬CMõƤąAvüVéŀ_VÌ³ĐwQj´·ZeÈÁ¨X´Æ¡Qu·»ÕZ³ġqDoy`L¬gdp°şp¦ėìÅĮZ°Iähzĵf²å ĚÑKpIN|Ñz]ń·FU×é»R³MÉ»GM«kiér}Ã`¹ăÞmÈnÁîRǀ³ĜoİzŔwǶVÚ£À]ɜ»ĆlƂ²ĠþTº·àUȞÏʦ¶I«dĽĢdĬ¿»Ĕ×h\\c¬ä²GêëĤł¥ÀǿżÃÆMº}BÕĢyFVvwxBèĻĒ©Ĉt@Ğû¸£B¯¨ˋäßkķ½ªôNÔ~t¼Ŵu^s¼{TA¼ø°¢İªDè¾Ň¶ÝJ®Z´ğ~Sn|ªWÚ©òzPOȸbð¢|øĞA"]],"encodeOffsets":[[[108815,30935],[100197,35028]]]},"properties":{"cp":[104.065735,30.659462],"name":"四川","childNum":2}},{"id":"520000","geometry":{"type":"MultiPolygon","coordinates":[["@@G\\lY£cj","@@q|mc¯vÏV","@@hÑ£IsNgßHHªķÃh_¹¡ĝÄ§ń¦uÙùgS¯JH|sÝÅtÁïyMDč»eÕtA¤{b\\}G®u\\åPFqwÅaDK°ºâ_£ùbµmÁÛĹM[q|hlaªāI}Ñµ@swtwm^oµDéĽŠyVky°ÉûÛR³e¥]RÕěħ[ƅåÛDpJiVÂF²I»mN·£LbÒYbWsÀbpkiTZĄă¶Hq`ĥ_J¯ae«KpÝx]aĕÛPÇȟ[ÁåŵÏő÷Pw}TÙ@Õs«ĿÛq©½m¤ÙH·yǥĘĉBµĨÕnđ]K©œáGçş§ÕßgǗĦTèƤƺ{¶ÉHÎd¾ŚÊ·OÐjXWrãLyzÉAL¾ę¢bĶėy_qMĔąro¼hĊw¶øV¤w²Ĉ]ÊKx|`ź¦ÂÈdrcÈbe¸`I¼čTF´¼Óýȃr¹ÍJ©k_șl³´_pĐ`oÒh¶pa^ÓĔ}D»^Xy`d[KvJPhèhCrĂĚÂ^Êƌ wZL­Ġ£ÁbrzOIlMMĪŐžËr×ÎeŦtw|¢mKjSǘňĂStÎŦEtqFT¾Eì¬¬ôxÌO¢ K³ŀºäYPVgŎ¦ŊmŞ¼VZwVlz¤£Tl®ctĽÚó{G­AÇge~Îd¿æaSba¥KKûj®_Ä^\\Ø¾bP®¦x^sxjĶI_Ä Xâ¼Hu¨Qh¡À@Ëô}±GNìĎlT¸`V~R°tbÕĊ`¸úÛtÏFDu[MfqGH·¥yAztMFe|R_GkChZeÚ°tov`xbDnÐ{E}ZèxNEÞREn[Pv@{~rĆAB§EO¿|UZ~ìUf¨J²ĂÝÆsªB`s¶fvö¦Õ~dÔq¨¸º»uù[[§´sb¤¢zþF¢ÆÀhÂW\\ıËIÝo±ĭŠ£þÊs}¡R]ěDg´VG¢j±®èºÃmpU[Áëº°rÜbNu¸}º¼`niºÔXĄ¤¼ÔdaµÁ_ÃftQQgR·Ǔv}Ý×ĵ]µWc¤F²OĩųãW½¯K©]{LóµCIµ±Mß¿h©āq¬o½~@i~TUxð´Đhw­ÀEîôuĶb[§nWuMÆJl½]vuıµb"]],"encodeOffsets":[[[112158,27383],[112105,27474],[112095,27476]]]},"properties":{"cp":[106.713478,26.578343],"name":"贵州","childNum":3}},{"id":"530000","geometry":{"type":"Polygon","coordinates":["@@[ùx½}ÑRHYīĺûsÍniEoã½Ya²ė{c¬ĝgĂsAØÅwďõzFjw}«Dx¿}Uũlê@HÅ­F¨ÇoJ´Ónũuą¡Ã¢pÒÅØ TF²xa²ËXcÊlHîAßËŁkŻƑŷÉ©hW­æßUËs¡¦}teèÆ¶StÇÇ}Fd£jĈZĆÆ¤Tč\\D}O÷£U§~ŃGåŃDĝ¸Tsd¶¶Bª¤u¢ŌĎo~t¾ÍŶÒtD¦ÚiôözØX²ghįh½Û±¯ÿm·zR¦Ɵ`ªŊÃh¢rOÔ´£Ym¼èêf¯ŪĽncÚbw\\zlvWªâ ¦gmĿBĹ£¢ƹřbĥkǫßeeZkÙIKueT»sVesbaĕ  ¶®dNĄÄpªy¼³BE®lGŭCǶwêżĔÂepÍÀQƞpC¼ŲÈ­AÎô¶RäQ^Øu¬°_Èôc´¹ò¨PÎ¢hlĎ¦´ĦÆ´sâÇŲPnÊD^¯°Upv}®BPÌªjǬxSöwlfòªvqĸ|`H­viļndĜ­Ćhňem·FyÞqóSį¯³X_ĞçêtryvL¤§z¦c¦¥jnŞklD¤øz½ĜàĂŧMÅ|áƆàÊcðÂFÜáŢ¥\\\\ºİøÒÐJĴîD¦zK²ǏÎEh~CD­hMn^ÌöÄ©ČZÀaüfɭyœpį´ěFűk]Ôě¢qlÅĆÙa¶~ÄqêljN¬¼HÊNQ´ê¼VØ¸E^ŃÒyM{JLoÒęæe±Ķygã¯JYÆĭĘëo¥Šo¯hcK«z_prC´ĢÖY¼ v¸¢RÅW³Â§fÇ¸Yi³xR´ďUË`êĿUûuĆBƣöNDH«ĈgÑaB{ÊNF´¬c·Åv}eÇÃGB»If¦HňĕM~[iwjUÁKE¾dĪçWIèÀoÈXòyŞŮÈXâÎŚj|àsRyµÖPr´þ ¸^wþTDŔHr¸RÌmfżÕâCôoxĜƌÆĮÐYtâŦÔ@]ÈǮƒ\\Ī¼Ä£UsÈ¯LbîƲŚºyhr@ĒÔƀÀ²º\\êpJ}ĠvqtĠ@^xÀ£È¨mËÏğ}n¹_¿¢×Y_æpÅA^{½Lu¨GO±Õ½ßM¶wÁĢÛPƢ¼pcĲx|apÌ¬HÐŊSfsðBZ¿©XÏÒKk÷Eû¿SrEFsÕūkóVǥŉiTL¡n{uxţÏhôŝ¬ğōNNJkyPaqÂğ¤K®YxÉƋÁ]āęDqçgOgILu\\_gz]W¼~CÔē]bµogpÑ_oď`´³Țkl`IªºÎȄqÔþ»E³ĎSJ»_f·adÇqÇc¥Á_Źw{L^É±ćxU£µ÷xgĉp»ĆqNē`rĘzaĵĚ¡K½ÊBzyäKXqiWPÏÉ¸½řÍcÊG|µƕƣGË÷k°_^ý|_zċBZocmø¯hhcæ\\lMFlư£ĜÆyHF¨µêÕ]HAàÓ^it `þßäkĤÎT~Wlÿ¨ÔPzUCNVv [jâôDôď[}z¿msSh¯{jïğl}šĹ[őgK©U·µË@¾m_~q¡f¹ÅË^»f³ø}Q¡ÖË³gÍ±^Ç\\ëÃA_¿bWÏ[¶ƛé£F{īZgm@|kHǭƁć¦UĔť×ëǟeċ¼ȡȘÏíBÉ£āĘPªĳ¶ŉÿy©nď£G¹¡I±LÉĺÑdĉÜW¥}gÁ{aqÃ¥aıęÏZÁ`"],"encodeOffsets":[[104636,22969]]},"properties":{"cp":[102.712251,25.040609],"name":"云南","childNum":1}},{"id":"540000","geometry":{"type":"Polygon","coordinates":["@@ÂhľxŖxÒVºÅâAĪÝȆµę¯Ňa±r_w~uSÕňqOj]ɄQ£ZUDûoY»©M[L¼qãË{VÍçWVi]ë©Ä÷àyƛhÚU°adcQ~Mx¥caÛcSyFÖk­uRýq¿ÔµQĽ³aG{¿FµëªéĜÿª@¬·K·àariĕĀ«V»ŶĴūgèLǴŇƶaftèBŚ£^âǐÝ®M¦ÁǞÿ¬LhJ¾óƾÆºcxwf]Y´¦|QLn°adĊ\\¨oǀÍŎ´ĩĀd`tÊQŞŕ|¨C^©Ĉ¦¦ÎJĊ{ëĎjª²rÐl`¼Ą[t|¦Stè¾PÜK¸dƄı]s¤î_v¹ÎVòŦj£Əsc¬_Ğ´|Ł¦Av¦w`ăaÝaa­¢e¤ı²©ªSªÈMĄwÉØŔì@T¤Ę\\õª@þo´­xA sÂtŎKzó²ÇČµ¢r^nĊ­Æ¬×üG¢³ {âĊ]G~bÀgVjzlhǶfOfdªB]pjTOtĊn¤}®¦Č¥d¢¼»ddY¼t¢eȤJ¤}Ǿ¡°§¤AÐlc@ĝsªćļđAçwxUuzEÖġ~AN¹ÄÅȀŻ¦¿ģŁéì±Hãd«g[Ø¼ēÀcīľġ¬cJµÐʥVȝ¸ßS¹ý±ğkƁ¼ą^ɛ¤Ûÿb[}¬ōõÃ]ËNm®g@Bg}ÍF±ǐyL¥íCIĳÏ÷Ñį[¹¦[âšEÛïÁÉdƅß{âNÆāŨß¾ě÷yC£k­´ÓH@Â¹TZ¥¢į·ÌAÐ§®Zcv½Z­¹|ÅWZqgW|ieZÅYVÓqdqbc²R@c¥Rã»GeeƃīQ}J[ÒK¬Ə|oėjġĠÑN¡ð¯EBčnwôɍėª²CλŹġǝʅįĭạ̃ūȹ]ΓͧgšsgȽóϧµǛęgſ¶ҍć`ĘąŌJÞä¤rÅň¥ÖÁUětęuůÞiĊÄÀ\\Æs¦ÓRb|Â^řÌkÄŷ¶½÷f±iMÝ@ĥ°G¬ÃM¥n£Øąğ¯ß§aëbéüÑOčk£{\\eµª×MÉfm«Ƒ{Å×Gŏǩãy³©WÑăû··Qòı}¯ãIéÕÂZ¨īès¶ZÈsæĔTŘvgÌsN@îá¾ó@ÙwU±ÉTå»£TđWxq¹Zobs[×¯cĩvėŧ³BM|¹kªħ¥TzNYnÝßpęrñĠĉRS~½ěVVµõ«M££µBĉ¥áºae~³AuĐh`Ü³ç@BÛïĿa©|z²Ý¼D£àč²ŸIûI āóK¥}rÝ_Á´éMaň¨~ªSĈ½½KÙóĿeƃÆB·¬ën×W|Uº}LJrƳlŒµ`bÔ`QÐÓ@s¬ñIÍ@ûws¡åQÑßÁ`ŋĴ{ĪTÚÅTSÄ³Yo|Ç[Ç¾µMW¢ĭiÕØ¿@MhpÕ]jéò¿OƇĆƇpêĉâlØwěsǩĵ¸cbU¹ř¨WavquSMzeo_^gsÏ·¥Ó@~¯¿RiīB\\qTGªÇĜçPoÿfñòą¦óQīÈáPābß{ZŗĸIæÅhnszÁCËìñÏ·ąĚÝUm®ó­L·ăUÈíoù´Êj°ŁŤ_uµ^°ìÇ@tĶĒ¡ÆM³Ģ«İĨÅ®ğRāðggheÆ¢zÊ©Ô\\°ÝĎz~ź¤PnMĪÖB£kné§żćĆKĒ°¼L¶èâz¨u¦¥LDĘz¬ýÎmĘd¾ßFzhg²Fy¦ĝ¤ċņbÎ@yĄæm°NĮZRÖíJ²öLĸÒ¨Y®ƌÐVàtt_ÚÂyĠz]ŢhzĎ{ÂĢXc|ÐqfO¢¤ögÌHNPKŖUú´xx[xvĐCûĀìÖT¬¸^}Ìsòd´_KgžLĴÀBon|H@Êx¦BpŰŌ¿fµƌA¾zǈRx¶FkĄźRzŀ~¶[´HnªVƞuĒ­È¨ƎcƽÌm¸ÁÈM¦x͊ëÀxǆBú^´W£dkɾĬpw˂ØɦļĬIŚÊnŔa¸~J°îlɌxĤÊÈðhÌ®gT´øàCÀ^ªerrƘd¢İP|Ė ŸWªĦ^¶´ÂLaT±üWƜǀRÂŶUńĖ[QhlLüAÜ\\qRĄ©"],"encodeOffsets":[[90849,37210]]},"properties":{"cp":[91.132212,29.660361],"name":"西藏","childNum":1}},{"id":"610000","geometry":{"type":"Polygon","coordinates":["@@¸ÂW¢xR­Fq§uF@N¢XLRMº[ğȣſï|¥Jkc`sŉǷ£Y³WN«ùMëï³ÛIg÷±mTșÚÒķø©þ¥yÓğęmWµÎumZyOŅƟĥÓ~sÑL¤µaÅY¦ocyZ{y c]{Ta©`U_Ěē£ωÊƍKùK¶ȱÝƷ§{û»ÅÁȹÍéuĳ|¹cÑdìUYOuFÕÈYvÁCqÓTǢí§·S¹NgV¬ë÷Át°DØ¯C´ŉƒópģ}ąiEËFéGU¥×K§­¶³BČ}C¿åċ`wġB·¤őcƭ²ő[Å^axwQOñJÙïŚĤNĔwƇÄńwĪ­o[_KÓª³ÙnKÇěÿ]ďă_d©·©Ýŏ°Ù®g]±ß×¥¬÷m\\iaǑkěX{¢|ZKlçhLtŇîŵœè[É@ƉĄEtƇÏ³­ħZ«mJ×¾MtÝĦ£IwÄå\\Õ{OwĬ©LÙ³ÙTª¿^¦rÌĢŭO¥lãyC§HÍ£ßEñX¡­°ÙCgpťzb`wIvA|¥hoĕ@E±iYd¥OÿµÇvPW|mCĴŜǂÒW¶¸AĜh^Wx{@¬­F¸¡ķn£P|ªĴ@^ĠĈæbÔc¶lYi^MicĎ°Â[ävï¶gv@ÀĬ·lJ¸sn|¼u~a]ÆÈtŌºJpþ£KKf~¦UbyäIĺãnÔ¿^­ŵMThĠÜ¤ko¼Ŏìąǜh`[tRd²Ĳ_XPrɲlXiL§à¹H°Ȧqº®QCbAŌJ¸ĕÚ³ĺ§ `d¨YjiZvRĺ±öVKkjGȊÄePĞZmļKÀ[`ösìhïÎoĬdtKÞ{¬èÒÒBÔpĲÇĬJŊ¦±J«[©ārHµàåVKe§|P²ÇÓ·vUzgnN¾yI@oHĆÛķhxen¡QQ±ƝJǖRbzy¸ËÐl¼EºpĤ¼x¼½~Ğà@ÚüdK^mÌSjp²ȮµûGĦ}Ħðǚ¶òƄjɂz°{ºØkÈęâ¦jªBg\\ċ°s¬]jú EȌǆ¬stRÆdĠİwÜ¸ôW¾ƮłÒ_{Ìû¼jº¹¢GǪÒ¯ĘZ`ºŊecņą~BÂgzpâēòYƲȐĎ"],"encodeOffsets":[[113634,40474]]},"properties":{"cp":[108.948024,34.263161],"name":"陕西","childNum":1}},{"id":"620000","geometry":{"type":"MultiPolygon","coordinates":[["@@Vu_^","@@ųEĠtt~nkh`Q¦ÅÄÜdwAb×ĠąJ¤DüègĺqBqj°lI¡Ĩ¶ĖIHdjÎB°aZ¢KJO[|A£Dx}NĂ¬HUnrk kp¼Y kMJn[aGáÚÏ[½rc}aQxOgsPMnUsncZsKúvAtÞġ£®ĀYKdnFw¢JE°Latf`¼h¬we|Æbj}GA·~W`¢MC¤tL©Ĳ°qdfObÞĬ¹ttu`^ZúE`[@Æsîz®¡CƳƜG²R¢RmfwĸgÜą G@pzJM½mhVy¸uÈÔO±¨{LfæU¶ßGĂq\\ª¬²I¥IŉÈīoıÓÑAçÑ|«LÝcspīðÍgtë_õ\\ĉñLYnĝgRǡÁiHLlõUĹ²uQjYi§Z_c¨´ĹĖÙ·ŋIaBD­R¹ȥr¯GºßK¨jWkɱOqWĳ\\a­Q\\sg_ĆǛōëp»£lğÛgSŶN®À]ÓämĹãJaz¥V}Le¤Lýo¹IsŋÅÇ^bz³tmEÁ´a¹cčecÇNĊãÁ\\č¯dNj]jZµkÓdaćå]ğĳ@ ©O{¤ĸm¢E·®«|@Xwg]Aģ±¯XǁÑǳªcwQÚŝñsÕ³ÛV_ý¥\\ů¥©¾÷w©WÕÊĩhÿÖÁRo¸V¬âDb¨hûxÊ×ǌ~Zâg|XÁnßYoº§ZÅŘv[ĭÖʃuďxcVbnUSfB¯³_TzºÎO©çMÑ~M³]µ^püµÄY~y@X~¤Z³[Èōl@®Å¼£QK·Di¡ByÿQ_´D¥hŗy^ĭÁZ]cIzýah¹MĪğPs{ò²Vw¹t³ŜË[Ñ}X\\gsF£sPAgěp×ëfYHāďÖqēŭOÏëdLü\\it^c®RÊº¶¢H°mrY£B¹čIoľu¶uI]vģSQ{UŻÅ}QÂ|Ì°ƅ¤ĩŪU ęĄÌZÒ\\v²PĔ»ƢNHĂyAmƂwVm`]ÈbH`Ì¢²ILvĜH®¤Dlt_¢JJÄämèÔDëþgºƫaʎÌrêYi~ Îİ¤NpÀA¾Ĕ¼bð÷®üszMzÖĖQdȨýv§Tè|ªHÃ¾a¸|Ð ƒwKĢx¦ivr^ÿ ¸l öæfƟĴ·PJv}n\\h¹¶v·À|\\ƁĚN´ĜçèÁz]ġ¤²¨QÒŨTIlªťØ}¼˗ƦvÄùØEÂ«FïËIqōTvāÜŏíÛßÛVj³âwGăÂíNOPìyV³ŉĖýZso§HÑiYw[ß\\X¦¥c]ÔƩÜ·«jÐqvÁ¦m^ċ±R¦΋ƈťĚgÀ»IïĨʗƮ°ƝĻþÍAƉſ±tÍEÕÞāNUÍ¡\\ſčåÒʻĘm ƭÌŹöʥëQ¤µ­ÇcƕªoIýIÉ_mkl³ăƓ¦j¡YzŇi}Msßõīʋ }ÁVm_[n}eı­Uĥ¼ªI{Î§DÓƻėojqYhĹT©oūĶ£]ďxĩǑMĝq`B´ƃ˺Чç~²ņj@¥@đ´ί}ĥtPńÇ¾V¬ufÓÉCtÓ̻¹£G³]ƖƾŎĪŪĘ̖¨ʈĢƂlɘ۪üºňUðǜȢƢż̌ȦǼĤŊɲĖÂ­KqĘŉ¼ĔǲņɾªǀÞĈĂD½ĄĎÌŗĞrôñnN¼â¾ʄľԆ|Ǆ֦ज़ȗǉ̘̭ɺƅêgV̍ʆĠ·ÌĊv|ýĖÕWĊǎÞ´õ¼cÒÒBĢ͢UĜð͒s¨ňƃLĉÕÝ@ɛƯ÷¿Ľ­ĹeȏĳëCȚDŲyê×Ŗyò¯ļcÂßYtÁƤyAã˾J@ǝrý@¤rz¸oP¹ɐÚyáHĀ[JwcVeȴÏ»ÈĖ}ƒŰŐèȭǢόĀƪÈŶë;Ñ̆ȤМľĮEŔĹŊũ~ËUă{ĻƹɁύȩþĽvĽƓÉ@ēĽɲßǐƫʾǗĒpäWÐxnsÀ^ƆwW©¦cÅ¡Ji§vúF¶¨c~c¼īeXǚ\\đ¾JwÀďksãAfÕ¦L}waoZD½Ml«]eÒÅaÉ²áo½FõÛ]ĻÒ¡wYR£¢rvÓ®y®LFLzĈôe]gx}|KK}xklL]c¦£fRtív¦PŨ£","@@M T¥"]],"encodeOffsets":[[[108619,36299],[108594,36341],[108600,36306]]]},"properties":{"cp":[103.823557,36.058039],"name":"甘肃","childNum":3}},{"id":"630000","geometry":{"type":"MultiPolygon","coordinates":[["@@InJo","@@CÆ½OŃĦsΰ~Ē³¦@@Ņi±è}ШƄ˹A³r_ĞǒNĪĐw¤^ŬĵªpĺSZgrpiƼĘÔ¨C|ÍJ©Ħ»®VĲ~f\\m `UnÂ~ʌĬàöNt~ňjy¢ZiƔ¥Ąk´nl`JÊJþ©pdƖ®È£¶ìRʦźõƮËnʼėæÑƀĎ[¢VÎĂMÖÝÎF²sƊƀÎBļýƞ¯ʘƭðħ¼Jh¿ŦęΌƇ¥²Q]Č¥nuÂÏri¸¬ƪÛ^Ó¦d¥[Wàx\\ZjÒ¨GtpþYŊĕ´zUOëPîMĄÁxH´áiÜUàîÜŐĂÛSuŎrJðÌ¬EFÁú×uÃÎkrĒ{V}İ«O_ÌËĬ©ÓŧSRÑ±§Ģ£^ÂyèçěM³Ƃę{[¸¿uºµ[gt£¸OƤĿéYõ·kĀq]juw¥DĩƍõÇPéÄ½G©ã¤GuȧþRcÕĕNyyût­øï»a½ē¿BMoį£Íj}éZËqbʍƬh¹ìÿÓAçãnIÃ¡I`ks£CG­ěUy×Cy@¶ʡÊBnāzGơMē¼±O÷õJËĚăVĪũƆ£¯{ËL½ÌzżVR|ĠTbuvJvµhĻĖHAëáa­OÇðñęNwœľ·LmI±íĠĩPÉ×®ÿscB³±JKßĊ«`ađ»·QAmOVţéÿ¤¹SQt]]Çx±¯A@ĉĳ¢Óļ©l¶ÅÛrŕspãRk~¦ª]Į­´FRåd­ČsCqđéFn¿ÅƃmÉx{W©ºƝºįkÕƂƑ¸wWūÐ©ÈF£\\tÈ¥ÄRÈýÌJ lGr^×äùyÞ³fjc¨£ÂZ|ǓMĝÏ@ëÜőRĝ÷¡{aïȷPu°ËXÙ{©TmĠ}Y³­ÞIňµç½©C¡į÷¯B»|St»]vųs»}MÓ ÿʪƟǭA¡fs»PY¼c¡»¦cċ­¥£~msĉPSi^o©AecPeǵkgyUi¿h}aHĉ^|á´¡HØûÅ«ĉ®]m¡qċ¶±ÈyôōLÁstB®wn±ă¥HSòė£Së@×œÊăxÇN©©T±ª£Ĳ¡fb®Þbb_Ą¥xu¥B{łĝ³«`dƐt¤ťiñÍUuºí`£^tƃĲc·ÛLO½sç¥Ts{ă\\_»kÏ±q©čiìĉ|ÍI¥ć¥]ª§D{ŝŖÉR_sÿc³ĪōƿÎ§p[ĉc¯bKmR¥{³Ze^wx¹dƽÅ½ôIg §Mĕ ƹĴ¿ǣÜÍ]Ý]snåA{eƭ`ǻŊĿ\\ĳŬűYÂÿ¬jĖqßb¸L«¸©@ěĀ©ê¶ìÀEH|´bRľÓ¶rÀQþvl®ÕETzÜdb hw¤{LRdcb¯ÙVgƜßzÃôì®^jUèXÎ|UäÌ»rK\\ªN¼pZCüVY¤ɃRi^rPŇTÖ}|br°qňbĚ°ªiƶGQ¾²x¦PmlŜ[Ĥ¡ΞsĦÔÏâ\\ªÚŒU\\f¢N²§x|¤§xĔsZPòʛ²SÐqF`ªVÞŜĶƨVZÌL`¢dŐIqr\\oäõFÎ·¤»Ŷ×h¹]ClÙ\\¦ďÌį¬řtTӺƙgQÇÓHţĒ´ÃbEÄlbʔC|CŮkƮ[ʼ¬ň´KŮÈΰÌĪ¶ƶlðļATUvdTGº̼ÔsÊDÔveMg"]],"encodeOffsets":[[[105308,37219],[95370,40081]]]},"properties":{"cp":[101.778916,36.623178],"name":"青海","childNum":2}},{"id":"640000","geometry":{"type":"Polygon","coordinates":["@@KëÀęĞ«Oęȿȕı]ŉ¡åįÕÔ«ǴõƪĚQÐZhv K°öqÀÑS[ÃÖHƖčËnL]ûcÙß@ĝ¾}w»»oģF¹»kÌÏ·{zP§B­¢íyÅt@@á]Yv_ssģ¼ißĻL¾ġsKD£¡N_X¸}B~HaiÅf{«x»ge_bsKF¯¡IxmELcÿZ¤­ĢÝsuBLùtYdmVtNmtOPhRw~bd¾qÐ\\âÙH\\bImlNZ»loqlVmGā§~QCw¤{A\\PKNY¯bFkC¥sks_Ã\\ă«¢ħkJi¯rrAhĹûç£CUĕĊ_ÔBixÅÙĄnªÑaM~ħpOu¥sîeQ¥¤^dkKwlL~{L~hw^ófćKyE­K­zuÔ¡qQ¤xZÑ¢^ļöÜ¾Ep±âbÊÑÆ^fk¬NC¾YpxbK~¥eÖäBlt¿Đx½I[ĒǙWf»Ĭ}d§dµùEuj¨IÆ¢¥dXªƅx¿]mtÏwßRĶX¢͎vÆzƂZò®ǢÌʆCrâºMÞzÆMÒÊÓŊZÄ¾r°Î®Ȉmª²ĈUªĚîøºĮ¦ÌĘk^FłĬhĚiĀĖ¾iİbjË"],"encodeOffsets":[[109366,40242]]},"properties":{"cp":[106.278179,38.46637],"name":"宁夏","childNum":1}},{"id":"650000","geometry":{"type":"Polygon","coordinates":["@@QØĔ²X¨~ǘBºjʐßØvKƔX¨vĊOÃ·¢i@~cĝe_«E}QxgɪëÏÃ@sÅyXoŖ{ô«ŸuXêÎf`C¹ÂÿÐGĮÕĞXŪōŸMźÈƺQèĽôe|¿ƸJR¤ĘEjcUóº¯Ĩ_ŘÁMª÷Ð¥OéÈ¿ÖğǤǷÂFÒzÉx[]­Ĥĝœ¦EP}ûƥé¿İƷTėƫœŕƅƱB»Đ±ēO¦E}`cȺrĦáŖuÒª«ĲπdƺÏØZƴwʄ¤ĖGĐǂZĶèH¶}ÚZצʥĪï|ÇĦMŔ»İĝǈì¥Βba­¯¥ǕǚkĆŵĦɑĺƯxūД̵nơʃĽá½M»òmqóŘĝčË¾ăCćāƿÝɽ©ǱŅ»ēėŊLrÁ®ɱĕģŉǻ̋ȥơŻǛȡVï¹Ň۩ûkɗġƁ§ʇė̕ĩũƽō^ƕUv£ƁQïƵkŏ½ΉÃŭÇ³LŇʻ«ƭ\\lŭD{ʓDkaFÃÄa³ŤđÔGRÈƚhSӹŚsİ«ĐË[¥ÚDkº^Øg¼ŵ¸£EÍöůŉT¡c_ËKYƧUśĵÝU_©rETÏʜ±OñtYwē¨{£¨uM³x½şL©Ùá[ÓÐĥ Νtģ¢\\śnkOw¥±T»ƷFɯàĩÞáB¹ÆÑUwŕĽw]kE½Èå~Æ÷QyěCFmĭZīŵVÁƿQƛûXS²b½KÏ½ĉS©ŷXĕ{ĕK·¥Ɨcqq©f¿]ßDõU³h­gËÇïģÉɋwk¯í}I·œbmÉřīJɥĻˁ×xoɹīlc¤³Xù]ǅA¿w͉ì¥wÇN·ÂËnƾƍdÇ§đ®ƝvUm©³G\\}µĿQyŹlăµEwǇQ½yƋBe¶ŋÀůo¥AÉw@{Gpm¿AĳŽKLh³`ñcËtW±»ÕSëüÿďDu\\wwwù³VLŕOMËGh£õP¡erÏd{ġWÁč|yšg^ğyÁzÙs`s|ÉåªÇ}m¢Ń¨`x¥ù^}Ì¥H«YªƅAÐ¹n~ź¯f¤áÀzgÇDIÔ´AňĀÒ¶ûEYospõD[{ù°]uJqU|Soċxţ[õÔĥkŋÞŭZËºóYËüċrw ÞkrťË¿XGÉbřaDü·Ē÷AÃª[ÄäIÂ®BÕĐÞ_¢āĠpÛÄȉĖġDKwbmÄNôfƫVÉviǳHQµâFù­Âœ³¦{YGd¢ĚÜO {Ö¦ÞÍÀP^bƾl[vt×ĈÍEË¨¡Đ~´î¸ùÎhuè`¸HÕŔVºwĠââWò@{ÙNÝ´ə²ȕn{¿¥{l÷eé^eďXj©î\\ªÑòÜìc\\üqÕ[Č¡xoÂċªbØ­ø|¶ȴZdÆÂońéG\\¼C°ÌÆn´nxÊOĨŪƴĸ¢¸òTxÊǪMīĞÖŲÃɎOvʦƢ~FRěò¿ġ~åŊúN¸qĘ[Ĕ¶ÂćnÒPĒÜvúĀÊbÖ{Äî¸~Ŕünp¤ÂH¾ĄYÒ©ÊfºmÔĘcDoĬMŬS¤s²ʘÚžȂVŦ èW°ªB|ĲXŔþÈJĦÆæFĚêYĂªĂ]øªŖNÞüAfɨJ¯ÎrDDĤ`mz\\§~D¬{vJÂ«lµĂb¤pŌŰNĄ¨ĊXW|ų ¿¾ɄĦƐMTòP÷fØĶK¢ȝ˔Sô¹òEð­`Ɩ½ǒÂň×äı§ĤƝ§C~¡hlåǺŦŞkâ~}FøàĲaĞfƠ¥Ŕd®U¸źXv¢aƆúŪtŠųƠjdƺƺÅìnrh\\ĺ¯äɝĦ]èpĄ¦´LƞĬ´ƤǬ˼Ēɸ¤rºǼ²¨zÌPðŀbþ¹ļD¢¹\\ĜÑŚ¶ZƄ³âjĦoâȴLÊȮĐ­ĚăÀêZǚŐ¤qȂ\\L¢ŌİfÆs|zºeªÙæ§΢{Ā´ƐÚ¬¨Ĵà²łhʺKÞºÖTiƢ¾ªì°`öøu®Ê¾ãÖ"],"encodeOffsets":[[88824,50096]]},"properties":{"cp":[87.617733,43.792818],"name":"新疆","childNum":1}},{"id":"110000","geometry":{"type":"Polygon","coordinates":["@@RºaYÕQaúÍÔiþĩȨWĢü|Ėu[qb[swP@ÅğP¿{\\¯Y²·Ñ¨j¯X\\¯MSvU¯YIŕY{[fk­VÁûtŷmiÍt_H»Ĩ±d`¹­{bwYr³S]§§o¹qGtm_SŧoaFLgQN_dV@Zom_ć\\ßW´ÕiœRcfio§ËgToÛJíĔóu|wP¤XnO¢ÉŦ¯pNÄā¤zâŖÈRpŢZÚ{GrFt¦Òx§ø¹RóäV¤XdżâºWbwŚ¨Ud®bêņ¾jnŎGŃŶnzÚScîĚZen¬"],"encodeOffsets":[[119421,42013]]},"properties":{"cp":[116.405285,39.904989],"name":"北京","childNum":1}},{"id":"120000","geometry":{"type":"Polygon","coordinates":["@@ŬgX§Ü«E¶FÌ¬O_ïlÁgz±AXeµÄĵ{¶]gitgIj·¥ì_iU¨ÐƎk}ĕ{gBqGf{¿aU^fIư³õ{YıëNĿk©ïËZukāAīlĕĥs¡bġ«@dekąI[nlPqCnp{ō³°`{PNdƗqSÄĻNNâyj]äÒD ĬH°Æ]~¡HO¾X}ÐxgpgWrDGpù^LrzWxZ^¨´T\\|~@IzbĤjeĊªz£®ĔvěLmV¾Ô_ÈNW~zbĬvG²ZmDM~~"],"encodeOffsets":[[120237,41215]]},"properties":{"cp":[117.190182,39.125596],"name":"天津","childNum":1}},{"id":"310000","geometry":{"type":"MultiPolygon","coordinates":[["@@ɧư¬EpƸÁx]","@@©²","@@MA","@@QpªKWT§¨","@@bŝÕÕEȣÚƥêImɇǦèÜĠÚÄÓŴ·ʌÇ","@@Sô¤r]ìƬįǜûȬɋŭ×^sYɍDŋŽąñCG²«ªč@h_p¯A{oloY¬j@Ĳ`gQÚpptǀ^MĲvtbe´Rh@oj¨","@@ÆLH{a}Eo¦"]],"encodeOffsets":[[[124702,32062],[124547,32200],[124808,31991],[124726,32110],[124903,32376],[124065,32166],[124870,31965]]]},"properties":{"cp":[121.472644,31.231706],"name":"上海","childNum":7}},{"id":"500000","geometry":{"type":"Polygon","coordinates":["@@TÂÛ`Ùƅően½SêqDu[RåÍ¹÷eXÍy¸_ĺę}÷`M¯ċfCVµqŉ÷Zgg^d½pDOÎCn^uf²ènh¼WtƏxRGg¦pVFI±G^Ic´ecGĹÞ½sëÆNäÌ¤KÓe¯|R¸§LÜkPoïƭNï¶}Gywdiù©nkĈzj@Óc£»Wă¹Óf§c[µo·Ó|MvÛaq½«è\\ÂoVnÓØÍ²«bq¿ehCĜ^Q~ Évýş¤²ĮpEĶyhsŊwH½¿gÅ¡ýE¡ya£³t\\¨\\vú¹¼©·Ñr_oÒý¥et³]Et©uÖ¥±ă©KVeë]}wVPÀFA¨ąB}qTjgRemfFmQFÝMyùnÑAmÑCawu_p¯sfÛ_gI_pNysB¦zG¸rHeN\\CvEsÐñÚkcDÖĉsaQ¯}_UzÁē}^R Äd^ÍĸZ¾·¶`wećJE¹vÛ·HgéFXjÉê`|ypxkAwWĐpb¥eOsmzwqChóUQl¥F^lafanòsrEvfQdÁUVfÎvÜ^eftET¬ôA\\¢sJnQTjPØxøK|nBzĞ»LYFDxÓvr[ehľvN¢o¾NiÂxGpâ¬zbfZo~hGi]öF||NbtOMn eA±tPTLjpYQ|SHYĀxinzDJÌg¢và¥Pg_ÇzIIII£®S¬ØsÎ¼¥¨^LnGĲļĲƤjÎƀƾ¹¸ØÎezĆT¸}êÐqHðqĖä¥^CÆIj²p\\_ æüY|[YxƊæu°xb®Űb@~¢NQt°¶Sæ Ê~rǉĔëĚ¢~uf`faĔJåĊnÔ]jƎćÊ@£¾a®£Ű{ŶĕFègLk{Y|¡ĜWƔtƬJÑxq±ĢN´òKLÈÃ¼D|s`ŋć]Ã`đMùƱ¿~Y°ħ`ƏíW½eI½{aOIrÏ¡ĕŇapµÜƃġ²"],"encodeOffsets":[[111728,31311]]},"properties":{"cp":[106.504962,29.533155],"name":"重庆","childNum":1}},{"id":"810000","geometry":{"type":"MultiPolygon","coordinates":[["@@AlFi","@@mp","@@EpHo","@@rMUwAS¬]","@@ea¢pl¸Eõ¹hj[]ÔCÎ@lj¡uBX´AI¹[yDU]W`çwZkmcMpÅv}IoJlcafŃK°ä¬XJmÐ đhI®æÔtSHnEÒrÄc"]],"encodeOffsets":[[[117111,23002],[117072,22876],[117045,22887],[116882,22747],[116975,23082]]]},"properties":{"cp":[114.173355,22.320048],"name":"香港","childNum":5}},{"id":"820000","geometry":{"type":"Polygon","coordinates":["@@áw{Îr"],"encodeOffsets":[[116285,22746]]},"properties":{"cp":[113.54909,22.198951],"name":"澳门","childNum":1}}],"UTF8Encoding":true}

/***/ }),

/***/ 1154:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(566);


/***/ }),

/***/ 130:
/***/ (function(module, exports, __webpack_require__) {


    var echarts = __webpack_require__(10);
    var zrUtil = __webpack_require__(2);
    module.exports = function (seriesType, actionInfos) {
        zrUtil.each(actionInfos, function (actionInfo) {
            actionInfo.update = 'updateView';
            /**
             * @payload
             * @property {string} seriesName
             * @property {string} name
             */
            echarts.registerAction(actionInfo, function (payload, ecModel) {
                var selected = {};
                ecModel.eachComponent(
                    {mainType: 'series', subType: seriesType, query: payload},
                    function (seriesModel) {
                        if (seriesModel[actionInfo.method]) {
                            seriesModel[actionInfo.method](
                                payload.name,
                                payload.dataIndex
                            );
                        }
                        var data = seriesModel.getData();
                        // Create selected map
                        data.each(function (idx) {
                            var name = data.getName(idx);
                            selected[name] = seriesModel.isSelected(name)
                                || false;
                        });
                    }
                );
                return {
                    name: payload.name,
                    selected: selected
                };
            });
        });
    };


/***/ }),

/***/ 132:
/***/ (function(module, exports, __webpack_require__) {

/**
 * Data selectable mixin for chart series.
 * To eanble data select, option of series must have `selectedMode`.
 * And each data item will use `selected` to toggle itself selected status
 *
 * @module echarts/chart/helper/DataSelectable
 */


    var zrUtil = __webpack_require__(2);

    module.exports = {

        updateSelectedMap: function (targetList) {
            this._targetList = targetList.slice();
            this._selectTargetMap = zrUtil.reduce(targetList || [], function (targetMap, target) {
                targetMap.set(target.name, target);
                return targetMap;
            }, zrUtil.createHashMap());
        },

        /**
         * Either name or id should be passed as input here.
         * If both of them are defined, id is used.
         *
         * @param {string|undefined} name name of data
         * @param {number|undefined} id dataIndex of data
         */
        // PENGING If selectedMode is null ?
        select: function (name, id) {
            var target = id != null
                ? this._targetList[id]
                : this._selectTargetMap.get(name);
            var selectedMode = this.get('selectedMode');
            if (selectedMode === 'single') {
                this._selectTargetMap.each(function (target) {
                    target.selected = false;
                });
            }
            target && (target.selected = true);
        },

        /**
         * Either name or id should be passed as input here.
         * If both of them are defined, id is used.
         *
         * @param {string|undefined} name name of data
         * @param {number|undefined} id dataIndex of data
         */
        unSelect: function (name, id) {
            var target = id != null
                ? this._targetList[id]
                : this._selectTargetMap.get(name);
            // var selectedMode = this.get('selectedMode');
            // selectedMode !== 'single' && target && (target.selected = false);
            target && (target.selected = false);
        },

        /**
         * Either name or id should be passed as input here.
         * If both of them are defined, id is used.
         *
         * @param {string|undefined} name name of data
         * @param {number|undefined} id dataIndex of data
         */
        toggleSelected: function (name, id) {
            var target = id != null
                ? this._targetList[id]
                : this._selectTargetMap.get(name);
            if (target != null) {
                this[target.selected ? 'unSelect' : 'select'](name, id);
                return target.selected;
            }
        },

        /**
         * Either name or id should be passed as input here.
         * If both of them are defined, id is used.
         *
         * @param {string|undefined} name name of data
         * @param {number|undefined} id dataIndex of data
         */
        isSelected: function (name, id) {
            var target = id != null
                ? this._targetList[id]
                : this._selectTargetMap.get(name);
            return target && target.selected;
        }
    };


/***/ }),

/***/ 142:
/***/ (function(module, exports, __webpack_require__) {



    var zrUtil = __webpack_require__(2);
    var echarts = __webpack_require__(10);

    __webpack_require__(143);
    __webpack_require__(144);

    __webpack_require__(130)('pie', [{
        type: 'pieToggleSelect',
        event: 'pieselectchanged',
        method: 'toggleSelected'
    }, {
        type: 'pieSelect',
        event: 'pieselected',
        method: 'select'
    }, {
        type: 'pieUnSelect',
        event: 'pieunselected',
        method: 'unSelect'
    }]);

    echarts.registerVisual(zrUtil.curry(__webpack_require__(151), 'pie'));

    echarts.registerLayout(zrUtil.curry(
        __webpack_require__(146), 'pie'
    ));

    echarts.registerProcessor(zrUtil.curry(__webpack_require__(148), 'pie'));


/***/ }),

/***/ 143:
/***/ (function(module, exports, __webpack_require__) {

"use strict";



    var List = __webpack_require__(135);
    var zrUtil = __webpack_require__(2);
    var modelUtil = __webpack_require__(29);
    var numberUtil = __webpack_require__(24);
    var completeDimensions = __webpack_require__(136);

    var dataSelectableMixin = __webpack_require__(132);

    var PieSeries = __webpack_require__(10).extendSeriesModel({

        type: 'series.pie',

        // Overwrite
        init: function (option) {
            PieSeries.superApply(this, 'init', arguments);

            // Enable legend selection for each data item
            // Use a function instead of direct access because data reference may changed
            this.legendDataProvider = function () {
                return this.getRawData();
            };

            this.updateSelectedMap(option.data);

            this._defaultLabelLine(option);
        },

        // Overwrite
        mergeOption: function (newOption) {
            PieSeries.superCall(this, 'mergeOption', newOption);
            this.updateSelectedMap(this.option.data);
        },

        getInitialData: function (option, ecModel) {
            var dimensions = completeDimensions(['value'], option.data);
            var list = new List(dimensions, this);
            list.initData(option.data);
            return list;
        },

        // Overwrite
        getDataParams: function (dataIndex) {
            var data = this.getData();
            var params = PieSeries.superCall(this, 'getDataParams', dataIndex);
            // FIXME toFixed?

            var valueList = [];
            data.each('value', function (value) {
                valueList.push(value);
            });

            params.percent = numberUtil.getPercentWithPrecision(
                valueList,
                dataIndex,
                data.hostModel.get('percentPrecision')
            );

            params.$vars.push('percent');
            return params;
        },

        _defaultLabelLine: function (option) {
            // Extend labelLine emphasis
            modelUtil.defaultEmphasis(option.labelLine, ['show']);

            var labelLineNormalOpt = option.labelLine.normal;
            var labelLineEmphasisOpt = option.labelLine.emphasis;
            // Not show label line if `label.normal.show = false`
            labelLineNormalOpt.show = labelLineNormalOpt.show
                && option.label.normal.show;
            labelLineEmphasisOpt.show = labelLineEmphasisOpt.show
                && option.label.emphasis.show;
        },

        defaultOption: {
            zlevel: 0,
            z: 2,
            legendHoverLink: true,

            hoverAnimation: true,
            // 默认全局居中
            center: ['50%', '50%'],
            radius: [0, '75%'],
            // 默认顺时针
            clockwise: true,
            startAngle: 90,
            // 最小角度改为0
            minAngle: 0,
            // 选中时扇区偏移量
            selectedOffset: 10,
            // 高亮扇区偏移量
            hoverOffset: 10,

            // If use strategy to avoid label overlapping
            avoidLabelOverlap: true,
            // 选择模式，默认关闭，可选single，multiple
            // selectedMode: false,
            // 南丁格尔玫瑰图模式，'radius'（半径） | 'area'（面积）
            // roseType: null,

            percentPrecision: 2,

            // If still show when all data zero.
            stillShowZeroSum: true,

            // cursor: null,

            label: {
                normal: {
                    // If rotate around circle
                    rotate: false,
                    show: true,
                    // 'outer', 'inside', 'center'
                    position: 'outer'
                    // formatter: 标签文本格式器，同Tooltip.formatter，不支持异步回调
                    // 默认使用全局文本样式，详见TEXTSTYLE
                    // distance: 当position为inner时有效，为label位置到圆心的距离与圆半径(环状图为内外半径和)的比例系数
                },
                emphasis: {}
            },
            // Enabled when label.normal.position is 'outer'
            labelLine: {
                normal: {
                    show: true,
                    // 引导线两段中的第一段长度
                    length: 15,
                    // 引导线两段中的第二段长度
                    length2: 15,
                    smooth: false,
                    lineStyle: {
                        // color: 各异,
                        width: 1,
                        type: 'solid'
                    }
                }
            },
            itemStyle: {
                normal: {
                    borderWidth: 1
                },
                emphasis: {}
            },

            // Animation type canbe expansion, scale
            animationType: 'expansion',

            animationEasing: 'cubicOut',

            data: []
        }
    });

    zrUtil.mixin(PieSeries, dataSelectableMixin);

    module.exports = PieSeries;


/***/ }),

/***/ 144:
/***/ (function(module, exports, __webpack_require__) {



    var graphic = __webpack_require__(17);
    var zrUtil = __webpack_require__(2);

    /**
     * @param {module:echarts/model/Series} seriesModel
     * @param {boolean} hasAnimation
     * @inner
     */
    function updateDataSelected(uid, seriesModel, hasAnimation, api) {
        var data = seriesModel.getData();
        var dataIndex = this.dataIndex;
        var name = data.getName(dataIndex);
        var selectedOffset = seriesModel.get('selectedOffset');

        api.dispatchAction({
            type: 'pieToggleSelect',
            from: uid,
            name: name,
            seriesId: seriesModel.id
        });

        data.each(function (idx) {
            toggleItemSelected(
                data.getItemGraphicEl(idx),
                data.getItemLayout(idx),
                seriesModel.isSelected(data.getName(idx)),
                selectedOffset,
                hasAnimation
            );
        });
    }

    /**
     * @param {module:zrender/graphic/Sector} el
     * @param {Object} layout
     * @param {boolean} isSelected
     * @param {number} selectedOffset
     * @param {boolean} hasAnimation
     * @inner
     */
    function toggleItemSelected(el, layout, isSelected, selectedOffset, hasAnimation) {
        var midAngle = (layout.startAngle + layout.endAngle) / 2;

        var dx = Math.cos(midAngle);
        var dy = Math.sin(midAngle);

        var offset = isSelected ? selectedOffset : 0;
        var position = [dx * offset, dy * offset];

        hasAnimation
            // animateTo will stop revious animation like update transition
            ? el.animate()
                .when(200, {
                    position: position
                })
                .start('bounceOut')
            : el.attr('position', position);
    }

    /**
     * Piece of pie including Sector, Label, LabelLine
     * @constructor
     * @extends {module:zrender/graphic/Group}
     */
    function PiePiece(data, idx) {

        graphic.Group.call(this);

        var sector = new graphic.Sector({
            z2: 2
        });
        var polyline = new graphic.Polyline();
        var text = new graphic.Text();
        this.add(sector);
        this.add(polyline);
        this.add(text);

        this.updateData(data, idx, true);

        // Hover to change label and labelLine
        function onEmphasis() {
            polyline.ignore = polyline.hoverIgnore;
            text.ignore = text.hoverIgnore;
        }
        function onNormal() {
            polyline.ignore = polyline.normalIgnore;
            text.ignore = text.normalIgnore;
        }
        this.on('emphasis', onEmphasis)
            .on('normal', onNormal)
            .on('mouseover', onEmphasis)
            .on('mouseout', onNormal);
    }

    var piePieceProto = PiePiece.prototype;

    piePieceProto.updateData = function (data, idx, firstCreate) {

        var sector = this.childAt(0);

        var seriesModel = data.hostModel;
        var itemModel = data.getItemModel(idx);
        var layout = data.getItemLayout(idx);
        var sectorShape = zrUtil.extend({}, layout);
        sectorShape.label = null;

        if (firstCreate) {
            sector.setShape(sectorShape);

            var animationType = seriesModel.getShallow('animationType');
            if (animationType === 'scale') {
                sector.shape.r = layout.r0;
                graphic.initProps(sector, {
                    shape: {
                        r: layout.r
                    }
                }, seriesModel, idx);
            }
            // Expansion
            else {
                sector.shape.endAngle = layout.startAngle;
                graphic.updateProps(sector, {
                    shape: {
                        endAngle: layout.endAngle
                    }
                }, seriesModel, idx);
            }

        }
        else {
            graphic.updateProps(sector, {
                shape: sectorShape
            }, seriesModel, idx);
        }

        // Update common style
        var itemStyleModel = itemModel.getModel('itemStyle');
        var visualColor = data.getItemVisual(idx, 'color');

        sector.useStyle(
            zrUtil.defaults(
                {
                    lineJoin: 'bevel',
                    fill: visualColor
                },
                itemStyleModel.getModel('normal').getItemStyle()
            )
        );
        sector.hoverStyle = itemStyleModel.getModel('emphasis').getItemStyle();

        var cursorStyle = itemModel.getShallow('cursor');
        cursorStyle && sector.attr('cursor', cursorStyle);

        // Toggle selected
        toggleItemSelected(
            this,
            data.getItemLayout(idx),
            itemModel.get('selected'),
            seriesModel.get('selectedOffset'),
            seriesModel.get('animation')
        );

        function onEmphasis() {
            // Sector may has animation of updating data. Force to move to the last frame
            // Or it may stopped on the wrong shape
            sector.stopAnimation(true);
            sector.animateTo({
                shape: {
                    r: layout.r + seriesModel.get('hoverOffset')
                }
            }, 300, 'elasticOut');
        }
        function onNormal() {
            sector.stopAnimation(true);
            sector.animateTo({
                shape: {
                    r: layout.r
                }
            }, 300, 'elasticOut');
        }
        sector.off('mouseover').off('mouseout').off('emphasis').off('normal');
        if (itemModel.get('hoverAnimation') && seriesModel.isAnimationEnabled()) {
            sector
                .on('mouseover', onEmphasis)
                .on('mouseout', onNormal)
                .on('emphasis', onEmphasis)
                .on('normal', onNormal);
        }

        this._updateLabel(data, idx);

        graphic.setHoverStyle(this);
    };

    piePieceProto._updateLabel = function (data, idx) {

        var labelLine = this.childAt(1);
        var labelText = this.childAt(2);

        var seriesModel = data.hostModel;
        var itemModel = data.getItemModel(idx);
        var layout = data.getItemLayout(idx);
        var labelLayout = layout.label;
        var visualColor = data.getItemVisual(idx, 'color');

        graphic.updateProps(labelLine, {
            shape: {
                points: labelLayout.linePoints || [
                    [labelLayout.x, labelLayout.y], [labelLayout.x, labelLayout.y], [labelLayout.x, labelLayout.y]
                ]
            }
        }, seriesModel, idx);

        graphic.updateProps(labelText, {
            style: {
                x: labelLayout.x,
                y: labelLayout.y
            }
        }, seriesModel, idx);
        labelText.attr({
            rotation: labelLayout.rotation,
            origin: [labelLayout.x, labelLayout.y],
            z2: 10
        });

        var labelModel = itemModel.getModel('label.normal');
        var labelHoverModel = itemModel.getModel('label.emphasis');
        var labelLineModel = itemModel.getModel('labelLine.normal');
        var labelLineHoverModel = itemModel.getModel('labelLine.emphasis');
        var visualColor = data.getItemVisual(idx, 'color');

        graphic.setLabelStyle(
            labelText.style, labelText.hoverStyle = {}, labelModel, labelHoverModel,
            {
                labelFetcher: data.hostModel,
                labelDataIndex: idx,
                defaultText: data.getName(idx),
                autoColor: visualColor,
                useInsideStyle: !!labelLayout.inside
            },
            {
                textAlign: labelLayout.textAlign,
                textVerticalAlign: labelLayout.verticalAlign,
                opacity: data.getItemVisual(idx, 'opacity')
            }
        );

        labelText.ignore = labelText.normalIgnore = !labelModel.get('show');
        labelText.hoverIgnore = !labelHoverModel.get('show');

        labelLine.ignore = labelLine.normalIgnore = !labelLineModel.get('show');
        labelLine.hoverIgnore = !labelLineHoverModel.get('show');

        // Default use item visual color
        labelLine.setStyle({
            stroke: visualColor,
            opacity: data.getItemVisual(idx, 'opacity')
        });
        labelLine.setStyle(labelLineModel.getModel('lineStyle').getLineStyle());

        labelLine.hoverStyle = labelLineHoverModel.getModel('lineStyle').getLineStyle();

        var smooth = labelLineModel.get('smooth');
        if (smooth && smooth === true) {
            smooth = 0.4;
        }
        labelLine.setShape({
            smooth: smooth
        });
    };

    zrUtil.inherits(PiePiece, graphic.Group);


    // Pie view
    var Pie = __webpack_require__(149).extend({

        type: 'pie',

        init: function () {
            var sectorGroup = new graphic.Group();
            this._sectorGroup = sectorGroup;
        },

        render: function (seriesModel, ecModel, api, payload) {
            if (payload && (payload.from === this.uid)) {
                return;
            }

            var data = seriesModel.getData();
            var oldData = this._data;
            var group = this.group;

            var hasAnimation = ecModel.get('animation');
            var isFirstRender = !oldData;
            var animationType = seriesModel.get('animationType');

            var onSectorClick = zrUtil.curry(
                updateDataSelected, this.uid, seriesModel, hasAnimation, api
            );

            var selectedMode = seriesModel.get('selectedMode');

            data.diff(oldData)
                .add(function (idx) {
                    var piePiece = new PiePiece(data, idx);
                    // Default expansion animation
                    if (isFirstRender && animationType !== 'scale') {
                        piePiece.eachChild(function (child) {
                            child.stopAnimation(true);
                        });
                    }

                    selectedMode && piePiece.on('click', onSectorClick);

                    data.setItemGraphicEl(idx, piePiece);

                    group.add(piePiece);
                })
                .update(function (newIdx, oldIdx) {
                    var piePiece = oldData.getItemGraphicEl(oldIdx);

                    piePiece.updateData(data, newIdx);

                    piePiece.off('click');
                    selectedMode && piePiece.on('click', onSectorClick);
                    group.add(piePiece);
                    data.setItemGraphicEl(newIdx, piePiece);
                })
                .remove(function (idx) {
                    var piePiece = oldData.getItemGraphicEl(idx);
                    group.remove(piePiece);
                })
                .execute();

            if (
                hasAnimation && isFirstRender && data.count() > 0
                // Default expansion animation
                && animationType !== 'scale'
            ) {
                var shape = data.getItemLayout(0);
                var r = Math.max(api.getWidth(), api.getHeight()) / 2;

                var removeClipPath = zrUtil.bind(group.removeClipPath, group);
                group.setClipPath(this._createClipPath(
                    shape.cx, shape.cy, r, shape.startAngle, shape.clockwise, removeClipPath, seriesModel
                ));
            }

            this._data = data;
        },

        dispose: function () {},

        _createClipPath: function (
            cx, cy, r, startAngle, clockwise, cb, seriesModel
        ) {
            var clipPath = new graphic.Sector({
                shape: {
                    cx: cx,
                    cy: cy,
                    r0: 0,
                    r: r,
                    startAngle: startAngle,
                    endAngle: startAngle,
                    clockwise: clockwise
                }
            });

            graphic.initProps(clipPath, {
                shape: {
                    endAngle: startAngle + (clockwise ? 1 : -1) * Math.PI * 2
                }
            }, seriesModel, cb);

            return clipPath;
        },

        /**
         * @implement
         */
        containPoint: function (point, seriesModel) {
            var data = seriesModel.getData();
            var itemLayout = data.getItemLayout(0);
            if (itemLayout) {
                var dx = point[0] - itemLayout.cx;
                var dy = point[1] - itemLayout.cy;
                var radius = Math.sqrt(dx * dx + dy * dy);
                return radius <= itemLayout.r && radius >= itemLayout.r0;
            }
        }

    });

    module.exports = Pie;


/***/ }),

/***/ 145:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// FIXME emphasis label position is not same with normal label position


    var textContain = __webpack_require__(81);

    function adjustSingleSide(list, cx, cy, r, dir, viewWidth, viewHeight) {
        list.sort(function (a, b) {
            return a.y - b.y;
        });

        // 压
        function shiftDown(start, end, delta, dir) {
            for (var j = start; j < end; j++) {
                list[j].y += delta;
                if (j > start
                    && j + 1 < end
                    && list[j + 1].y > list[j].y + list[j].height
                ) {
                    shiftUp(j, delta / 2);
                    return;
                }
            }

            shiftUp(end - 1, delta / 2);
        }

        // 弹
        function shiftUp(end, delta) {
            for (var j = end; j >= 0; j--) {
                list[j].y -= delta;
                if (j > 0
                    && list[j].y > list[j - 1].y + list[j - 1].height
                ) {
                    break;
                }
            }
        }

        function changeX(list, isDownList, cx, cy, r, dir) {
            var lastDeltaX = dir > 0
                ? isDownList                // 右侧
                    ? Number.MAX_VALUE      // 下
                    : 0                     // 上
                : isDownList                // 左侧
                    ? Number.MAX_VALUE      // 下
                    : 0;                    // 上

            for (var i = 0, l = list.length; i < l; i++) {
                // Not change x for center label
                if (list[i].position === 'center') {
                    continue;
                }
                var deltaY = Math.abs(list[i].y - cy);
                var length = list[i].len;
                var length2 = list[i].len2;
                var deltaX = (deltaY < r + length)
                    ? Math.sqrt(
                          (r + length + length2) * (r + length + length2)
                          - deltaY * deltaY
                      )
                    : Math.abs(list[i].x - cx);
                if (isDownList && deltaX >= lastDeltaX) {
                    // 右下，左下
                    deltaX = lastDeltaX - 10;
                }
                if (!isDownList && deltaX <= lastDeltaX) {
                    // 右上，左上
                    deltaX = lastDeltaX + 10;
                }

                list[i].x = cx + deltaX * dir;
                lastDeltaX = deltaX;
            }
        }

        var lastY = 0;
        var delta;
        var len = list.length;
        var upList = [];
        var downList = [];
        for (var i = 0; i < len; i++) {
            delta = list[i].y - lastY;
            if (delta < 0) {
                shiftDown(i, len, -delta, dir);
            }
            lastY = list[i].y + list[i].height;
        }
        if (viewHeight - lastY < 0) {
            shiftUp(len - 1, lastY - viewHeight);
        }
        for (var i = 0; i < len; i++) {
            if (list[i].y >= cy) {
                downList.push(list[i]);
            }
            else {
                upList.push(list[i]);
            }
        }
        changeX(upList, false, cx, cy, r, dir);
        changeX(downList, true, cx, cy, r, dir);
    }

    function avoidOverlap(labelLayoutList, cx, cy, r, viewWidth, viewHeight) {
        var leftList = [];
        var rightList = [];
        for (var i = 0; i < labelLayoutList.length; i++) {
            if (labelLayoutList[i].x < cx) {
                leftList.push(labelLayoutList[i]);
            }
            else {
                rightList.push(labelLayoutList[i]);
            }
        }

        adjustSingleSide(rightList, cx, cy, r, 1, viewWidth, viewHeight);
        adjustSingleSide(leftList, cx, cy, r, -1, viewWidth, viewHeight);

        for (var i = 0; i < labelLayoutList.length; i++) {
            var linePoints = labelLayoutList[i].linePoints;
            if (linePoints) {
                var dist = linePoints[1][0] - linePoints[2][0];
                if (labelLayoutList[i].x < cx) {
                    linePoints[2][0] = labelLayoutList[i].x + 3;
                }
                else {
                    linePoints[2][0] = labelLayoutList[i].x - 3;
                }
                linePoints[1][1] = linePoints[2][1] = labelLayoutList[i].y;
                linePoints[1][0] = linePoints[2][0] + dist;
            }
        }
    }

    module.exports = function (seriesModel, r, viewWidth, viewHeight) {
        var data = seriesModel.getData();
        var labelLayoutList = [];
        var cx;
        var cy;
        var hasLabelRotate = false;

        data.each(function (idx) {
            var layout = data.getItemLayout(idx);

            var itemModel = data.getItemModel(idx);
            var labelModel = itemModel.getModel('label.normal');
            // Use position in normal or emphasis
            var labelPosition = labelModel.get('position') || itemModel.get('label.emphasis.position');

            var labelLineModel = itemModel.getModel('labelLine.normal');
            var labelLineLen = labelLineModel.get('length');
            var labelLineLen2 = labelLineModel.get('length2');

            var midAngle = (layout.startAngle + layout.endAngle) / 2;
            var dx = Math.cos(midAngle);
            var dy = Math.sin(midAngle);

            var textX;
            var textY;
            var linePoints;
            var textAlign;

            cx = layout.cx;
            cy = layout.cy;

            var isLabelInside = labelPosition === 'inside' || labelPosition === 'inner';
            if (labelPosition === 'center') {
                textX = layout.cx;
                textY = layout.cy;
                textAlign = 'center';
            }
            else {
                var x1 = (isLabelInside ? (layout.r + layout.r0) / 2 * dx : layout.r * dx) + cx;
                var y1 = (isLabelInside ? (layout.r + layout.r0) / 2 * dy : layout.r * dy) + cy;

                textX = x1 + dx * 3;
                textY = y1 + dy * 3;

                if (!isLabelInside) {
                    // For roseType
                    var x2 = x1 + dx * (labelLineLen + r - layout.r);
                    var y2 = y1 + dy * (labelLineLen + r - layout.r);
                    var x3 = x2 + ((dx < 0 ? -1 : 1) * labelLineLen2);
                    var y3 = y2;

                    textX = x3 + (dx < 0 ? -5 : 5);
                    textY = y3;
                    linePoints = [[x1, y1], [x2, y2], [x3, y3]];
                }

                textAlign = isLabelInside ? 'center' : (dx > 0 ? 'left' : 'right');
            }
            var font = labelModel.getFont();

            var labelRotate = labelModel.get('rotate')
                ? (dx < 0 ? -midAngle + Math.PI : -midAngle) : 0;
            var text = seriesModel.getFormattedLabel(idx, 'normal')
                        || data.getName(idx);
            var textRect = textContain.getBoundingRect(
                text, font, textAlign, 'top'
            );
            hasLabelRotate = !!labelRotate;
            layout.label = {
                x: textX,
                y: textY,
                position: labelPosition,
                height: textRect.height,
                len: labelLineLen,
                len2: labelLineLen2,
                linePoints: linePoints,
                textAlign: textAlign,
                verticalAlign: 'middle',
                rotation: labelRotate,
                inside: isLabelInside
            };

            // Not layout the inside label
            if (!isLabelInside) {
                labelLayoutList.push(layout.label);
            }
        });
        if (!hasLabelRotate && seriesModel.get('avoidLabelOverlap')) {
            avoidOverlap(labelLayoutList, cx, cy, r, viewWidth, viewHeight);
        }
    };


/***/ }),

/***/ 146:
/***/ (function(module, exports, __webpack_require__) {



    var numberUtil = __webpack_require__(24);
    var parsePercent = numberUtil.parsePercent;
    var labelLayout = __webpack_require__(145);
    var zrUtil = __webpack_require__(2);

    var PI2 = Math.PI * 2;
    var RADIAN = Math.PI / 180;

    module.exports = function (seriesType, ecModel, api, payload) {
        ecModel.eachSeriesByType(seriesType, function (seriesModel) {
            var center = seriesModel.get('center');
            var radius = seriesModel.get('radius');

            if (!zrUtil.isArray(radius)) {
                radius = [0, radius];
            }
            if (!zrUtil.isArray(center)) {
                center = [center, center];
            }

            var width = api.getWidth();
            var height = api.getHeight();
            var size = Math.min(width, height);
            var cx = parsePercent(center[0], width);
            var cy = parsePercent(center[1], height);
            var r0 = parsePercent(radius[0], size / 2);
            var r = parsePercent(radius[1], size / 2);

            var data = seriesModel.getData();

            var startAngle = -seriesModel.get('startAngle') * RADIAN;

            var minAngle = seriesModel.get('minAngle') * RADIAN;

            var validDataCount = 0;
            data.each('value', function (value) {
                !isNaN(value) && validDataCount++;
            });

            var sum = data.getSum('value');
            // Sum may be 0
            var unitRadian = Math.PI / (sum || validDataCount) * 2;

            var clockwise = seriesModel.get('clockwise');

            var roseType = seriesModel.get('roseType');
            var stillShowZeroSum = seriesModel.get('stillShowZeroSum');

            // [0...max]
            var extent = data.getDataExtent('value');
            extent[0] = 0;

            // In the case some sector angle is smaller than minAngle
            var restAngle = PI2;
            var valueSumLargerThanMinAngle = 0;

            var currentAngle = startAngle;
            var dir = clockwise ? 1 : -1;

            data.each('value', function (value, idx) {
                var angle;
                if (isNaN(value)) {
                    data.setItemLayout(idx, {
                        angle: NaN,
                        startAngle: NaN,
                        endAngle: NaN,
                        clockwise: clockwise,
                        cx: cx,
                        cy: cy,
                        r0: r0,
                        r: roseType
                            ? NaN
                            : r
                    });
                    return;
                }

                // FIXME 兼容 2.0 但是 roseType 是 area 的时候才是这样？
                if (roseType !== 'area') {
                    angle = (sum === 0 && stillShowZeroSum)
                        ? unitRadian : (value * unitRadian);
                }
                else {
                    angle = PI2 / validDataCount;
                }

                if (angle < minAngle) {
                    angle = minAngle;
                    restAngle -= minAngle;
                }
                else {
                    valueSumLargerThanMinAngle += value;
                }

                var endAngle = currentAngle + dir * angle;
                data.setItemLayout(idx, {
                    angle: angle,
                    startAngle: currentAngle,
                    endAngle: endAngle,
                    clockwise: clockwise,
                    cx: cx,
                    cy: cy,
                    r0: r0,
                    r: roseType
                        ? numberUtil.linearMap(value, extent, [r0, r])
                        : r
                });

                currentAngle = endAngle;
            }, true);

            // Some sector is constrained by minAngle
            // Rest sectors needs recalculate angle
            if (restAngle < PI2 && validDataCount) {
                // Average the angle if rest angle is not enough after all angles is
                // Constrained by minAngle
                if (restAngle <= 1e-3) {
                    var angle = PI2 / validDataCount;
                    data.each('value', function (value, idx) {
                        if (!isNaN(value)) {
                            var layout = data.getItemLayout(idx);
                            layout.angle = angle;
                            layout.startAngle = startAngle + dir * idx * angle;
                            layout.endAngle = startAngle + dir * (idx + 1) * angle;
                        }
                    });
                }
                else {
                    unitRadian = restAngle / valueSumLargerThanMinAngle;
                    currentAngle = startAngle;
                    data.each('value', function (value, idx) {
                        if (!isNaN(value)) {
                            var layout = data.getItemLayout(idx);
                            var angle = layout.angle === minAngle
                                ? minAngle : value * unitRadian;
                            layout.startAngle = currentAngle;
                            layout.endAngle = currentAngle + dir * angle;
                            currentAngle += dir * angle;
                        }
                    });
                }
            }

            labelLayout(seriesModel, r, width, height);
        });
    };


/***/ }),

/***/ 148:
/***/ (function(module, exports) {


    module.exports = function (seriesType, ecModel) {
        var legendModels = ecModel.findComponents({
            mainType: 'legend'
        });
        if (!legendModels || !legendModels.length) {
            return;
        }
        ecModel.eachSeriesByType(seriesType, function (series) {
            var data = series.getData();
            data.filterSelf(function (idx) {
                var name = data.getName(idx);
                // If in any legend component the status is not selected.
                for (var i = 0; i < legendModels.length; i++) {
                    if (!legendModels[i].isSelected(name)) {
                        return false;
                    }
                }
                return true;
            }, this);
        }, this);
    };


/***/ }),

/***/ 150:
/***/ (function(module, exports, __webpack_require__) {

/**
 * @file Visual mapping.
 */


    var zrUtil = __webpack_require__(2);
    var zrColor = __webpack_require__(138);
    var linearMap = __webpack_require__(24).linearMap;
    var each = zrUtil.each;
    var isObject = zrUtil.isObject;

    var CATEGORY_DEFAULT_VISUAL_INDEX = -1;

    /**
     * @param {Object} option
     * @param {string} [option.type] See visualHandlers.
     * @param {string} [option.mappingMethod] 'linear' or 'piecewise' or 'category' or 'fixed'
     * @param {Array.<number>=} [option.dataExtent] [minExtent, maxExtent],
     *                                              required when mappingMethod is 'linear'
     * @param {Array.<Object>=} [option.pieceList] [
     *                                             {value: someValue},
     *                                             {interval: [min1, max1], visual: {...}},
     *                                             {interval: [min2, max2]}
     *                                             ],
     *                                            required when mappingMethod is 'piecewise'.
     *                                            Visual for only each piece can be specified.
     * @param {Array.<string|Object>=} [option.categories] ['cate1', 'cate2']
     *                                            required when mappingMethod is 'category'.
     *                                            If no option.categories, categories is set
     *                                            as [0, 1, 2, ...].
     * @param {boolean} [option.loop=false] Whether loop mapping when mappingMethod is 'category'.
     * @param {(Array|Object|*)} [option.visual]  Visual data.
     *                                            when mappingMethod is 'category',
     *                                            visual data can be array or object
     *                                            (like: {cate1: '#222', none: '#fff'})
     *                                            or primary types (which represents
     *                                            defualt category visual), otherwise visual
     *                                            can be array or primary (which will be
     *                                            normalized to array).
     *
     */
    var VisualMapping = function (option) {
        var mappingMethod = option.mappingMethod;
        var visualType = option.type;

        /**
         * @readOnly
         * @type {Object}
         */
        var thisOption = this.option = zrUtil.clone(option);

        /**
         * @readOnly
         * @type {string}
         */
        this.type = visualType;

        /**
         * @readOnly
         * @type {string}
         */
        this.mappingMethod = mappingMethod;

        /**
         * @private
         * @type {Function}
         */
        this._normalizeData = normalizers[mappingMethod];

        var visualHandler = visualHandlers[visualType];

        /**
         * @public
         * @type {Function}
         */
        this.applyVisual = visualHandler.applyVisual;

        /**
         * @public
         * @type {Function}
         */
        this.getColorMapper = visualHandler.getColorMapper;

        /**
         * @private
         * @type {Function}
         */
        this._doMap = visualHandler._doMap[mappingMethod];

        if (mappingMethod === 'piecewise') {
            normalizeVisualRange(thisOption);
            preprocessForPiecewise(thisOption);
        }
        else if (mappingMethod === 'category') {
            thisOption.categories
                ? preprocessForSpecifiedCategory(thisOption)
                // categories is ordinal when thisOption.categories not specified,
                // which need no more preprocess except normalize visual.
                : normalizeVisualRange(thisOption, true);
        }
        else { // mappingMethod === 'linear' or 'fixed'
            zrUtil.assert(mappingMethod !== 'linear' || thisOption.dataExtent);
            normalizeVisualRange(thisOption);
        }
    };

    VisualMapping.prototype = {

        constructor: VisualMapping,

        mapValueToVisual: function (value) {
            var normalized = this._normalizeData(value);
            return this._doMap(normalized, value);
        },

        getNormalizer: function () {
            return zrUtil.bind(this._normalizeData, this);
        }
    };

    var visualHandlers = VisualMapping.visualHandlers = {

        color: {

            applyVisual: makeApplyVisual('color'),

            /**
             * Create a mapper function
             * @return {Function}
             */
            getColorMapper: function () {
                var thisOption = this.option;

                return zrUtil.bind(
                    thisOption.mappingMethod === 'category'
                        ? function (value, isNormalized) {
                            !isNormalized && (value = this._normalizeData(value));
                            return doMapCategory.call(this, value);
                        }
                        : function (value, isNormalized, out) {
                            // If output rgb array
                            // which will be much faster and useful in pixel manipulation
                            var returnRGBArray = !!out;
                            !isNormalized && (value = this._normalizeData(value));
                            out = zrColor.fastLerp(value, thisOption.parsedVisual, out);
                            return returnRGBArray ? out : zrColor.stringify(out, 'rgba');
                        },
                    this
                );
            },

            _doMap: {
                linear: function (normalized) {
                    return zrColor.stringify(
                        zrColor.fastLerp(normalized, this.option.parsedVisual),
                        'rgba'
                    );
                },
                category: doMapCategory,
                piecewise: function (normalized, value) {
                    var result = getSpecifiedVisual.call(this, value);
                    if (result == null) {
                        result = zrColor.stringify(
                            zrColor.fastLerp(normalized, this.option.parsedVisual),
                            'rgba'
                        );
                    }
                    return result;
                },
                fixed: doMapFixed
            }
        },

        colorHue: makePartialColorVisualHandler(function (color, value) {
            return zrColor.modifyHSL(color, value);
        }),

        colorSaturation: makePartialColorVisualHandler(function (color, value) {
            return zrColor.modifyHSL(color, null, value);
        }),

        colorLightness: makePartialColorVisualHandler(function (color, value) {
            return zrColor.modifyHSL(color, null, null, value);
        }),

        colorAlpha: makePartialColorVisualHandler(function (color, value) {
            return zrColor.modifyAlpha(color, value);
        }),

        opacity: {
            applyVisual: makeApplyVisual('opacity'),
            _doMap: makeDoMap([0, 1])
        },

        symbol: {
            applyVisual: function (value, getter, setter) {
                var symbolCfg = this.mapValueToVisual(value);
                if (zrUtil.isString(symbolCfg)) {
                    setter('symbol', symbolCfg);
                }
                else if (isObject(symbolCfg)) {
                    for (var name in symbolCfg) {
                        if (symbolCfg.hasOwnProperty(name)) {
                            setter(name, symbolCfg[name]);
                        }
                    }
                }
            },
            _doMap: {
                linear: doMapToArray,
                category: doMapCategory,
                piecewise: function (normalized, value) {
                    var result = getSpecifiedVisual.call(this, value);
                    if (result == null) {
                        result = doMapToArray.call(this, normalized);
                    }
                    return result;
                },
                fixed: doMapFixed
            }
        },

        symbolSize: {
            applyVisual: makeApplyVisual('symbolSize'),
            _doMap: makeDoMap([0, 1])
        }
    };


    function preprocessForPiecewise(thisOption) {
        var pieceList = thisOption.pieceList;
        thisOption.hasSpecialVisual = false;

        zrUtil.each(pieceList, function (piece, index) {
            piece.originIndex = index;
            // piece.visual is "result visual value" but not
            // a visual range, so it does not need to be normalized.
            if (piece.visual != null) {
                thisOption.hasSpecialVisual = true;
            }
        });
    }

    function preprocessForSpecifiedCategory(thisOption) {
        // Hash categories.
        var categories = thisOption.categories;
        var visual = thisOption.visual;

        var categoryMap = thisOption.categoryMap = {};
        each(categories, function (cate, index) {
            categoryMap[cate] = index;
        });

        // Process visual map input.
        if (!zrUtil.isArray(visual)) {
            var visualArr = [];

            if (zrUtil.isObject(visual)) {
                each(visual, function (v, cate) {
                    var index = categoryMap[cate];
                    visualArr[index != null ? index : CATEGORY_DEFAULT_VISUAL_INDEX] = v;
                });
            }
            else { // Is primary type, represents default visual.
                visualArr[CATEGORY_DEFAULT_VISUAL_INDEX] = visual;
            }

            visual = setVisualToOption(thisOption, visualArr);
        }

        // Remove categories that has no visual,
        // then we can mapping them to CATEGORY_DEFAULT_VISUAL_INDEX.
        for (var i = categories.length - 1; i >= 0; i--) {
            if (visual[i] == null) {
                delete categoryMap[categories[i]];
                categories.pop();
            }
        }
    }

    function normalizeVisualRange(thisOption, isCategory) {
        var visual = thisOption.visual;
        var visualArr = [];

        if (zrUtil.isObject(visual)) {
            each(visual, function (v) {
                visualArr.push(v);
            });
        }
        else if (visual != null) {
            visualArr.push(visual);
        }

        var doNotNeedPair = {color: 1, symbol: 1};

        if (!isCategory
            && visualArr.length === 1
            && !doNotNeedPair.hasOwnProperty(thisOption.type)
        ) {
            // Do not care visualArr.length === 0, which is illegal.
            visualArr[1] = visualArr[0];
        }

        setVisualToOption(thisOption, visualArr);
    }

    function makePartialColorVisualHandler(applyValue) {
        return {
            applyVisual: function (value, getter, setter) {
                value = this.mapValueToVisual(value);
                // Must not be array value
                setter('color', applyValue(getter('color'), value));
            },
            _doMap: makeDoMap([0, 1])
        };
    }

    function doMapToArray(normalized) {
        var visual = this.option.visual;
        return visual[
            Math.round(linearMap(normalized, [0, 1], [0, visual.length - 1], true))
        ] || {};
    }

    function makeApplyVisual(visualType) {
        return function (value, getter, setter) {
            setter(visualType, this.mapValueToVisual(value));
        };
    }

    function doMapCategory(normalized) {
        var visual = this.option.visual;
        return visual[
            (this.option.loop && normalized !== CATEGORY_DEFAULT_VISUAL_INDEX)
                ? normalized % visual.length
                : normalized
        ];
    }

    function doMapFixed() {
        return this.option.visual[0];
    }

    function makeDoMap(sourceExtent) {
        return {
            linear: function (normalized) {
                return linearMap(normalized, sourceExtent, this.option.visual, true);
            },
            category: doMapCategory,
            piecewise: function (normalized, value) {
                var result = getSpecifiedVisual.call(this, value);
                if (result == null) {
                    result = linearMap(normalized, sourceExtent, this.option.visual, true);
                }
                return result;
            },
            fixed: doMapFixed
        };
    }

    function getSpecifiedVisual(value) {
        var thisOption = this.option;
        var pieceList = thisOption.pieceList;
        if (thisOption.hasSpecialVisual) {
            var pieceIndex = VisualMapping.findPieceIndex(value, pieceList);
            var piece = pieceList[pieceIndex];
            if (piece && piece.visual) {
                return piece.visual[this.type];
            }
        }
    }

    function setVisualToOption(thisOption, visualArr) {
        thisOption.visual = visualArr;
        if (thisOption.type === 'color') {
            thisOption.parsedVisual = zrUtil.map(visualArr, function (item) {
                return zrColor.parse(item);
            });
        }
        return visualArr;
    }


    /**
     * Normalizers by mapping methods.
     */
    var normalizers = {

        linear: function (value) {
            return linearMap(value, this.option.dataExtent, [0, 1], true);
        },

        piecewise: function (value) {
            var pieceList = this.option.pieceList;
            var pieceIndex = VisualMapping.findPieceIndex(value, pieceList, true);
            if (pieceIndex != null) {
                return linearMap(pieceIndex, [0, pieceList.length - 1], [0, 1], true);
            }
        },

        category: function (value) {
            var index = this.option.categories
                ? this.option.categoryMap[value]
                : value; // ordinal
            return index == null ? CATEGORY_DEFAULT_VISUAL_INDEX : index;
        },

        fixed: zrUtil.noop
    };



    /**
     * List available visual types.
     *
     * @public
     * @return {Array.<string>}
     */
    VisualMapping.listVisualTypes = function () {
        var visualTypes = [];
        zrUtil.each(visualHandlers, function (handler, key) {
            visualTypes.push(key);
        });
        return visualTypes;
    };

    /**
     * @public
     */
    VisualMapping.addVisualHandler = function (name, handler) {
        visualHandlers[name] = handler;
    };

    /**
     * @public
     */
    VisualMapping.isValidType = function (visualType) {
        return visualHandlers.hasOwnProperty(visualType);
    };

    /**
     * Convinent method.
     * Visual can be Object or Array or primary type.
     *
     * @public
     */
    VisualMapping.eachVisual = function (visual, callback, context) {
        if (zrUtil.isObject(visual)) {
            zrUtil.each(visual, callback, context);
        }
        else {
            callback.call(context, visual);
        }
    };

    VisualMapping.mapVisual = function (visual, callback, context) {
        var isPrimary;
        var newVisual = zrUtil.isArray(visual)
            ? []
            : zrUtil.isObject(visual)
            ? {}
            : (isPrimary = true, null);

        VisualMapping.eachVisual(visual, function (v, key) {
            var newVal = callback.call(context, v, key);
            isPrimary ? (newVisual = newVal) : (newVisual[key] = newVal);
        });
        return newVisual;
    };

    /**
     * @public
     * @param {Object} obj
     * @return {Object} new object containers visual values.
     *                 If no visuals, return null.
     */
    VisualMapping.retrieveVisuals = function (obj) {
        var ret = {};
        var hasVisual;

        obj && each(visualHandlers, function (h, visualType) {
            if (obj.hasOwnProperty(visualType)) {
                ret[visualType] = obj[visualType];
                hasVisual = true;
            }
        });

        return hasVisual ? ret : null;
    };

    /**
     * Give order to visual types, considering colorSaturation, colorAlpha depends on color.
     *
     * @public
     * @param {(Object|Array)} visualTypes If Object, like: {color: ..., colorSaturation: ...}
     *                                     IF Array, like: ['color', 'symbol', 'colorSaturation']
     * @return {Array.<string>} Sorted visual types.
     */
    VisualMapping.prepareVisualTypes = function (visualTypes) {
        if (isObject(visualTypes)) {
            var types = [];
            each(visualTypes, function (item, type) {
                types.push(type);
            });
            visualTypes = types;
        }
        else if (zrUtil.isArray(visualTypes)) {
            visualTypes = visualTypes.slice();
        }
        else {
            return [];
        }

        visualTypes.sort(function (type1, type2) {
            // color should be front of colorSaturation, colorAlpha, ...
            // symbol and symbolSize do not matter.
            return (type2 === 'color' && type1 !== 'color' && type1.indexOf('color') === 0)
                ? 1 : -1;
        });

        return visualTypes;
    };

    /**
     * 'color', 'colorSaturation', 'colorAlpha', ... are depends on 'color'.
     * Other visuals are only depends on themself.
     *
     * @public
     * @param {string} visualType1
     * @param {string} visualType2
     * @return {boolean}
     */
    VisualMapping.dependsOn = function (visualType1, visualType2) {
        return visualType2 === 'color'
            ? !!(visualType1 && visualType1.indexOf(visualType2) === 0)
            : visualType1 === visualType2;
    };

    /**
     * @param {number} value
     * @param {Array.<Object>} pieceList [{value: ..., interval: [min, max]}, ...]
     *                         Always from small to big.
     * @param {boolean} [findClosestWhenOutside=false]
     * @return {number} index
     */
    VisualMapping.findPieceIndex = function (value, pieceList, findClosestWhenOutside) {
        var possibleI;
        var abs = Infinity;

        // value has the higher priority.
        for (var i = 0, len = pieceList.length; i < len; i++) {
            var pieceValue = pieceList[i].value;
            if (pieceValue != null) {
                if (pieceValue === value
                    // FIXME
                    // It is supposed to compare value according to value type of dimension,
                    // but currently value type can exactly be string or number.
                    // Compromise for numeric-like string (like '12'), especially
                    // in the case that visualMap.categories is ['22', '33'].
                    || (typeof pieceValue === 'string' && pieceValue === value + '')
                ) {
                    return i;
                }
                findClosestWhenOutside && updatePossible(pieceValue, i);
            }
        }

        for (var i = 0, len = pieceList.length; i < len; i++) {
            var piece = pieceList[i];
            var interval = piece.interval;
            var close = piece.close;

            if (interval) {
                if (interval[0] === -Infinity) {
                    if (littleThan(close[1], value, interval[1])) {
                        return i;
                    }
                }
                else if (interval[1] === Infinity) {
                    if (littleThan(close[0], interval[0], value)) {
                        return i;
                    }
                }
                else if (
                    littleThan(close[0], interval[0], value)
                    && littleThan(close[1], value, interval[1])
                ) {
                    return i;
                }
                findClosestWhenOutside && updatePossible(interval[0], i);
                findClosestWhenOutside && updatePossible(interval[1], i);
            }
        }

        if (findClosestWhenOutside) {
            return value === Infinity
                ? pieceList.length - 1
                : value === -Infinity
                ? 0
                : possibleI;
        }

        function updatePossible(val, index) {
            var newAbs = Math.abs(val - value);
            if (newAbs < abs) {
                abs = newAbs;
                possibleI = index;
            }
        }

    };

    function littleThan(close, a, b) {
        return close ? a <= b : a < b;
    }

    module.exports = VisualMapping;



/***/ }),

/***/ 151:
/***/ (function(module, exports) {

// Pick color from palette for each data item.
// Applicable for charts that require applying color palette
// in data level (like pie, funnel, chord).


    module.exports = function (seriesType, ecModel) {
        // Pie and funnel may use diferrent scope
        var paletteScope = {};
        ecModel.eachRawSeriesByType(seriesType, function (seriesModel) {
            var dataAll = seriesModel.getRawData();
            var idxMap = {};
            if (!ecModel.isSeriesFiltered(seriesModel)) {
                var data = seriesModel.getData();
                data.each(function (idx) {
                    var rawIdx = data.getRawIndex(idx);
                    idxMap[rawIdx] = idx;
                });
                dataAll.each(function (rawIdx) {
                    var filteredIdx = idxMap[rawIdx];

                    // If series.itemStyle.normal.color is a function. itemVisual may be encoded
                    var singleDataColor = filteredIdx != null
                        && data.getItemVisual(filteredIdx, 'color', true);

                    if (!singleDataColor) {
                        // FIXME Performance
                        var itemModel = dataAll.getItemModel(rawIdx);
                        var color = itemModel.get('itemStyle.normal.color')
                            || seriesModel.getColorFromPalette(dataAll.getName(rawIdx), paletteScope);
                        // Legend may use the visual info in data before processed
                        dataAll.setItemVisual(rawIdx, 'color', color);

                        // Data is not filtered
                        if (filteredIdx != null) {
                            data.setItemVisual(filteredIdx, 'color', color);
                        }
                    }
                    else {
                        // Set data all color for legend
                        dataAll.setItemVisual(rawIdx, 'color', singleDataColor);
                    }
                });
            }
        });
    };


/***/ }),

/***/ 361:
/***/ (function(module, exports, __webpack_require__) {

/**
 * @file Controller visual map model
 */


    var echarts = __webpack_require__(10);
    var zrUtil = __webpack_require__(2);
    var env = __webpack_require__(52);
    var visualDefault = __webpack_require__(379);
    var VisualMapping = __webpack_require__(150);
    var visualSolution = __webpack_require__(380);
    var mapVisual = VisualMapping.mapVisual;
    var modelUtil = __webpack_require__(29);
    var eachVisual = VisualMapping.eachVisual;
    var numberUtil = __webpack_require__(24);
    var isArray = zrUtil.isArray;
    var each = zrUtil.each;
    var asc = numberUtil.asc;
    var linearMap = numberUtil.linearMap;
    var noop = zrUtil.noop;

    var DEFAULT_COLOR = ['#f6efa6', '#d88273', '#bf444c'];

    var VisualMapModel = echarts.extendComponentModel({

        type: 'visualMap',

        dependencies: ['series'],

        /**
         * @readOnly
         * @type {Array.<string>}
         */
        stateList: ['inRange', 'outOfRange'],

        /**
         * @readOnly
         * @type {Array.<string>}
         */
        replacableOptionKeys: [
            'inRange', 'outOfRange', 'target', 'controller', 'color'
        ],

        /**
         * [lowerBound, upperBound]
         *
         * @readOnly
         * @type {Array.<number>}
         */
        dataBound: [-Infinity, Infinity],

        /**
         * @readOnly
         * @type {string|Object}
         */
        layoutMode: {type: 'box', ignoreSize: true},

        /**
         * @protected
         */
        defaultOption: {
            show: true,

            zlevel: 0,
            z: 4,

            seriesIndex: 'all',     // 'all' or null/undefined: all series.
                                    // A number or an array of number: the specified series.

                                    // set min: 0, max: 200, only for campatible with ec2.
                                    // In fact min max should not have default value.
            min: 0,                 // min value, must specified if pieces is not specified.
            max: 200,               // max value, must specified if pieces is not specified.

            dimension: null,
            inRange: null,          // 'color', 'colorHue', 'colorSaturation', 'colorLightness', 'colorAlpha',
                                    // 'symbol', 'symbolSize'
            outOfRange: null,       // 'color', 'colorHue', 'colorSaturation',
                                    // 'colorLightness', 'colorAlpha',
                                    // 'symbol', 'symbolSize'

            left: 0,                // 'center' ¦ 'left' ¦ 'right' ¦ {number} (px)
            right: null,            // The same as left.
            top: null,              // 'top' ¦ 'bottom' ¦ 'center' ¦ {number} (px)
            bottom: 0,              // The same as top.

            itemWidth: null,
            itemHeight: null,
            inverse: false,
            orient: 'vertical',        // 'horizontal' ¦ 'vertical'

            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: '#ccc',       // 值域边框颜色
            contentColor: '#5793f3',
            inactiveColor: '#aaa',
            borderWidth: 0,            // 值域边框线宽，单位px，默认为0（无边框）
            padding: 5,                // 值域内边距，单位px，默认各方向内边距为5，
                                       // 接受数组分别设定上右下左边距，同css
            textGap: 10,               //
            precision: 0,              // 小数精度，默认为0，无小数点
            color: null,               //颜色（deprecated，兼容ec2，顺序同pieces，不同于inRange/outOfRange）

            formatter: null,
            text: null,                // 文本，如['高', '低']，兼容ec2，text[0]对应高值，text[1]对应低值
            textStyle: {
                color: '#333'          // 值域文字颜色
            }
        },

        /**
         * @protected
         */
        init: function (option, parentModel, ecModel) {

            /**
             * @private
             * @type {Array.<number>}
             */
            this._dataExtent;

            /**
             * @readOnly
             */
            this.targetVisuals = {};

            /**
             * @readOnly
             */
            this.controllerVisuals = {};

            /**
             * @readOnly
             */
            this.textStyleModel;

            /**
             * [width, height]
             * @readOnly
             * @type {Array.<number>}
             */
            this.itemSize;

            this.mergeDefaultAndTheme(option, ecModel);
        },

        /**
         * @protected
         */
        optionUpdated: function (newOption, isInit) {
            var thisOption = this.option;

            // FIXME
            // necessary?
            // Disable realtime view update if canvas is not supported.
            if (!env.canvasSupported) {
                thisOption.realtime = false;
            }

            !isInit && visualSolution.replaceVisualOption(
                thisOption, newOption, this.replacableOptionKeys
            );

            this.textStyleModel = this.getModel('textStyle');

            this.resetItemSize();

            this.completeVisualOption();
        },

        /**
         * @protected
         */
        resetVisual: function (supplementVisualOption) {
            var stateList = this.stateList;
            supplementVisualOption = zrUtil.bind(supplementVisualOption, this);

            this.controllerVisuals = visualSolution.createVisualMappings(
                this.option.controller, stateList, supplementVisualOption
            );
            this.targetVisuals = visualSolution.createVisualMappings(
                this.option.target, stateList, supplementVisualOption
            );
        },

        /**
         * @protected
         * @return {Array.<number>} An array of series indices.
         */
        getTargetSeriesIndices: function () {
            var optionSeriesIndex = this.option.seriesIndex;
            var seriesIndices = [];

            if (optionSeriesIndex == null || optionSeriesIndex === 'all') {
                this.ecModel.eachSeries(function (seriesModel, index) {
                    seriesIndices.push(index);
                });
            }
            else {
                seriesIndices = modelUtil.normalizeToArray(optionSeriesIndex);
            }

            return seriesIndices;
        },

        /**
         * @public
         */
        eachTargetSeries: function (callback, context) {
            zrUtil.each(this.getTargetSeriesIndices(), function (seriesIndex) {
                callback.call(context, this.ecModel.getSeriesByIndex(seriesIndex));
            }, this);
        },

        /**
         * @pubilc
         */
        isTargetSeries: function (seriesModel) {
            var is = false;
            this.eachTargetSeries(function (model) {
                model === seriesModel && (is = true);
            });
            return is;
        },

        /**
         * @example
         * this.formatValueText(someVal); // format single numeric value to text.
         * this.formatValueText(someVal, true); // format single category value to text.
         * this.formatValueText([min, max]); // format numeric min-max to text.
         * this.formatValueText([this.dataBound[0], max]); // using data lower bound.
         * this.formatValueText([min, this.dataBound[1]]); // using data upper bound.
         *
         * @param {number|Array.<number>} value Real value, or this.dataBound[0 or 1].
         * @param {boolean} [isCategory=false] Only available when value is number.
         * @param {Array.<string>} edgeSymbols Open-close symbol when value is interval.
         * @return {string}
         * @protected
         */
        formatValueText: function(value, isCategory, edgeSymbols) {
            var option = this.option;
            var precision = option.precision;
            var dataBound = this.dataBound;
            var formatter = option.formatter;
            var isMinMax;
            var textValue;
            edgeSymbols = edgeSymbols || ['<', '>'];

            if (zrUtil.isArray(value)) {
                value = value.slice();
                isMinMax = true;
            }

            textValue = isCategory
                ? value
                : (isMinMax
                    ? [toFixed(value[0]), toFixed(value[1])]
                    : toFixed(value)
                );

            if (zrUtil.isString(formatter)) {
                return formatter
                    .replace('{value}', isMinMax ? textValue[0] : textValue)
                    .replace('{value2}', isMinMax ? textValue[1] : textValue);
            }
            else if (zrUtil.isFunction(formatter)) {
                return isMinMax
                    ? formatter(value[0], value[1])
                    : formatter(value);
            }

            if (isMinMax) {
                if (value[0] === dataBound[0]) {
                    return edgeSymbols[0] + ' ' + textValue[1];
                }
                else if (value[1] === dataBound[1]) {
                    return edgeSymbols[1] + ' ' + textValue[0];
                }
                else {
                    return textValue[0] + ' - ' + textValue[1];
                }
            }
            else { // Format single value (includes category case).
                return textValue;
            }

            function toFixed(val) {
                return val === dataBound[0]
                    ? 'min'
                    : val === dataBound[1]
                    ? 'max'
                    : (+val).toFixed(Math.min(precision, 20));
            }
        },

        /**
         * @protected
         */
        resetExtent: function () {
            var thisOption = this.option;

            // Can not calculate data extent by data here.
            // Because series and data may be modified in processing stage.
            // So we do not support the feature "auto min/max".

            var extent = asc([thisOption.min, thisOption.max]);

            this._dataExtent = extent;
        },

        /**
         * @public
         * @param {module:echarts/data/List} list
         * @return {string} Concrete dimention. If return null/undefined,
         *                  no dimension used.
         */
        getDataDimension: function (list) {
            var optDim = this.option.dimension;
            return optDim != null
                ? optDim : list.dimensions.length - 1;
        },

        /**
         * @public
         * @override
         */
        getExtent: function () {
            return this._dataExtent.slice();
        },

        /**
         * @protected
         */
        completeVisualOption: function () {
            var thisOption = this.option;
            var base = {inRange: thisOption.inRange, outOfRange: thisOption.outOfRange};

            var target = thisOption.target || (thisOption.target = {});
            var controller = thisOption.controller || (thisOption.controller = {});

            zrUtil.merge(target, base); // Do not override
            zrUtil.merge(controller, base); // Do not override

            var isCategory = this.isCategory();

            completeSingle.call(this, target);
            completeSingle.call(this, controller);
            completeInactive.call(this, target, 'inRange', 'outOfRange');
            // completeInactive.call(this, target, 'outOfRange', 'inRange');
            completeController.call(this, controller);

            function completeSingle(base) {
                // Compatible with ec2 dataRange.color.
                // The mapping order of dataRange.color is: [high value, ..., low value]
                // whereas inRange.color and outOfRange.color is [low value, ..., high value]
                // Notice: ec2 has no inverse.
                if (isArray(thisOption.color)
                    // If there has been inRange: {symbol: ...}, adding color is a mistake.
                    // So adding color only when no inRange defined.
                    && !base.inRange
                ) {
                    base.inRange = {color: thisOption.color.slice().reverse()};
                }

                // Compatible with previous logic, always give a defautl color, otherwise
                // simple config with no inRange and outOfRange will not work.
                // Originally we use visualMap.color as the default color, but setOption at
                // the second time the default color will be erased. So we change to use
                // constant DEFAULT_COLOR.
                // If user do not want the defualt color, set inRange: {color: null}.
                base.inRange = base.inRange || {color: DEFAULT_COLOR};

                // If using shortcut like: {inRange: 'symbol'}, complete default value.
                each(this.stateList, function (state) {
                    var visualType = base[state];

                    if (zrUtil.isString(visualType)) {
                        var defa = visualDefault.get(visualType, 'active', isCategory);
                        if (defa) {
                            base[state] = {};
                            base[state][visualType] = defa;
                        }
                        else {
                            // Mark as not specified.
                            delete base[state];
                        }
                    }
                }, this);
            }

            function completeInactive(base, stateExist, stateAbsent) {
                var optExist = base[stateExist];
                var optAbsent = base[stateAbsent];

                if (optExist && !optAbsent) {
                    optAbsent = base[stateAbsent] = {};
                    each(optExist, function (visualData, visualType) {
                        if (!VisualMapping.isValidType(visualType)) {
                            return;
                        }

                        var defa = visualDefault.get(visualType, 'inactive', isCategory);

                        if (defa != null) {
                            optAbsent[visualType] = defa;

                            // Compatibable with ec2:
                            // Only inactive color to rgba(0,0,0,0) can not
                            // make label transparent, so use opacity also.
                            if (visualType === 'color'
                                && !optAbsent.hasOwnProperty('opacity')
                                && !optAbsent.hasOwnProperty('colorAlpha')
                            ) {
                                optAbsent.opacity = [0, 0];
                            }
                        }
                    });
                }
            }

            function completeController(controller) {
                var symbolExists = (controller.inRange || {}).symbol
                    || (controller.outOfRange || {}).symbol;
                var symbolSizeExists = (controller.inRange || {}).symbolSize
                    || (controller.outOfRange || {}).symbolSize;
                var inactiveColor = this.get('inactiveColor');

                each(this.stateList, function (state) {

                    var itemSize = this.itemSize;
                    var visuals = controller[state];

                    // Set inactive color for controller if no other color
                    // attr (like colorAlpha) specified.
                    if (!visuals) {
                        visuals = controller[state] = {
                            color: isCategory ? inactiveColor : [inactiveColor]
                        };
                    }

                    // Consistent symbol and symbolSize if not specified.
                    if (visuals.symbol == null) {
                        visuals.symbol = symbolExists
                            && zrUtil.clone(symbolExists)
                            || (isCategory ? 'roundRect' : ['roundRect']);
                    }
                    if (visuals.symbolSize == null) {
                        visuals.symbolSize = symbolSizeExists
                            && zrUtil.clone(symbolSizeExists)
                            || (isCategory ? itemSize[0] : [itemSize[0], itemSize[0]]);
                    }

                    // Filter square and none.
                    visuals.symbol = mapVisual(visuals.symbol, function (symbol) {
                        return (symbol === 'none' || symbol === 'square') ? 'roundRect' : symbol;
                    });

                    // Normalize symbolSize
                    var symbolSize = visuals.symbolSize;

                    if (symbolSize != null) {
                        var max = -Infinity;
                        // symbolSize can be object when categories defined.
                        eachVisual(symbolSize, function (value) {
                            value > max && (max = value);
                        });
                        visuals.symbolSize = mapVisual(symbolSize, function (value) {
                            return linearMap(value, [0, max], [0, itemSize[0]], true);
                        });
                    }

                }, this);
            }
        },

        /**
         * @protected
         */
        resetItemSize: function () {
            this.itemSize = [
                parseFloat(this.get('itemWidth')),
                parseFloat(this.get('itemHeight'))
            ];
        },

        /**
         * @public
         */
        isCategory: function () {
            return !!this.option.categories;
        },

        /**
         * @public
         * @abstract
         */
        setSelected: noop,

        /**
         * @public
         * @abstract
         * @param {*|module:echarts/data/List} valueOrData
         * @param {number} dataIndex
         * @return {string} state See this.stateList
         */
        getValueState: noop,

        /**
         * FIXME
         * Do not publish to thirt-part-dev temporarily
         * util the interface is stable. (Should it return
         * a function but not visual meta?)
         *
         * @pubilc
         * @abstract
         * @param {Function} getColorVisual
         *        params: value, valueState
         *        return: color
         * @return {Object} visualMeta
         *        should includes {stops, outerColors}
         *        outerColor means [colorBeyondMinValue, colorBeyondMaxValue]
         */
        getVisualMeta: noop

    });

    module.exports = VisualMapModel;



/***/ }),

/***/ 362:
/***/ (function(module, exports, __webpack_require__) {



    var zrUtil = __webpack_require__(2);
    var graphic = __webpack_require__(17);
    var formatUtil = __webpack_require__(46);
    var layout = __webpack_require__(45);
    var echarts = __webpack_require__(10);
    var VisualMapping = __webpack_require__(150);

    module.exports = echarts.extendComponentView({

        type: 'visualMap',

        /**
         * @readOnly
         * @type {Object}
         */
        autoPositionValues: {left: 1, right: 1, top: 1, bottom: 1},

        init: function (ecModel, api) {
            /**
             * @readOnly
             * @type {module:echarts/model/Global}
             */
            this.ecModel = ecModel;

            /**
             * @readOnly
             * @type {module:echarts/ExtensionAPI}
             */
            this.api = api;

            /**
             * @readOnly
             * @type {module:echarts/component/visualMap/visualMapModel}
             */
            this.visualMapModel;
        },

        /**
         * @protected
         */
        render: function (visualMapModel, ecModel, api, payload) {
            this.visualMapModel = visualMapModel;

            if (visualMapModel.get('show') === false) {
                this.group.removeAll();
                return;
            }

            this.doRender.apply(this, arguments);
        },

        /**
         * @protected
         */
        renderBackground: function (group) {
            var visualMapModel = this.visualMapModel;
            var padding = formatUtil.normalizeCssArray(visualMapModel.get('padding') || 0);
            var rect = group.getBoundingRect();

            group.add(new graphic.Rect({
                z2: -1, // Lay background rect on the lowest layer.
                silent: true,
                shape: {
                    x: rect.x - padding[3],
                    y: rect.y - padding[0],
                    width: rect.width + padding[3] + padding[1],
                    height: rect.height + padding[0] + padding[2]
                },
                style: {
                    fill: visualMapModel.get('backgroundColor'),
                    stroke: visualMapModel.get('borderColor'),
                    lineWidth: visualMapModel.get('borderWidth')
                }
            }));
        },

        /**
         * @protected
         * @param {number} targetValue can be Infinity or -Infinity
         * @param {string=} visualCluster Only can be 'color' 'opacity' 'symbol' 'symbolSize'
         * @param {Object} [opts]
         * @param {string=} [opts.forceState] Specify state, instead of using getValueState method.
         * @param {string=} [opts.convertOpacityToAlpha=false] For color gradient in controller widget.
         * @return {*} Visual value.
         */
        getControllerVisual: function (targetValue, visualCluster, opts) {
            opts = opts || {};

            var forceState = opts.forceState;
            var visualMapModel = this.visualMapModel;
            var visualObj = {};

            // Default values.
            if (visualCluster === 'symbol') {
                visualObj.symbol = visualMapModel.get('itemSymbol');
            }
            if (visualCluster === 'color') {
                var defaultColor = visualMapModel.get('contentColor');
                visualObj.color = defaultColor;
            }

            function getter(key) {
                return visualObj[key];
            }

            function setter(key, value) {
                visualObj[key] = value;
            }

            var mappings = visualMapModel.controllerVisuals[
                forceState || visualMapModel.getValueState(targetValue)
            ];
            var visualTypes = VisualMapping.prepareVisualTypes(mappings);

            zrUtil.each(visualTypes, function (type) {
                var visualMapping = mappings[type];
                if (opts.convertOpacityToAlpha && type === 'opacity') {
                    type = 'colorAlpha';
                    visualMapping = mappings.__alphaForOpacity;
                }
                if (VisualMapping.dependsOn(type, visualCluster)) {
                    visualMapping && visualMapping.applyVisual(
                        targetValue, getter, setter
                    );
                }
            });

            return visualObj[visualCluster];
        },

        /**
         * @protected
         */
        positionGroup: function (group) {
            var model = this.visualMapModel;
            var api = this.api;

            layout.positionElement(
                group,
                model.getBoxLayoutParams(),
                {width: api.getWidth(), height: api.getHeight()}
            );
        },

        /**
         * @protected
         * @abstract
         */
        doRender: zrUtil.noop

    });



/***/ }),

/***/ 363:
/***/ (function(module, exports, __webpack_require__) {



    var zrUtil = __webpack_require__(2);
    var layout = __webpack_require__(45);

    var helper = {

        /**
         * @param {module:echarts/component/visualMap/VisualMapModel} visualMapModel\
         * @param {module:echarts/ExtensionAPI} api
         * @param {Array.<number>} itemSize always [short, long]
         * @return {string} 'left' or 'right' or 'top' or 'bottom'
         */
        getItemAlign: function (visualMapModel, api, itemSize) {
            var modelOption = visualMapModel.option;
            var itemAlign = modelOption.align;

            if (itemAlign != null && itemAlign !== 'auto') {
                return itemAlign;
            }

            // Auto decision align.
            var ecSize = {width: api.getWidth(), height: api.getHeight()};
            var realIndex = modelOption.orient === 'horizontal' ? 1 : 0;

            var paramsSet = [
                ['left', 'right', 'width'],
                ['top', 'bottom', 'height']
            ];
            var reals = paramsSet[realIndex];
            var fakeValue = [0, null, 10];

            var layoutInput = {};
            for (var i = 0; i < 3; i++) {
                layoutInput[paramsSet[1 - realIndex][i]] = fakeValue[i];
                layoutInput[reals[i]] = i === 2 ? itemSize[0] : modelOption[reals[i]];
            }

            var rParam = [['x', 'width', 3], ['y', 'height', 0]][realIndex];
            var rect = layout.getLayoutRect(layoutInput, ecSize, modelOption.padding);

            return reals[
                (rect.margin[rParam[2]] || 0) + rect[rParam[0]] + rect[rParam[1]] * 0.5
                    < ecSize[rParam[1]] * 0.5 ? 0 : 1
            ];
        },

        /**
         * Prepare dataIndex for outside usage, where dataIndex means rawIndex, and
         * dataIndexInside means filtered index.
         */
        convertDataIndex: function (batch) {
            zrUtil.each(batch || [], function (batchItem) {
                if (batch.dataIndex != null) {
                    batch.dataIndexInside = batch.dataIndex;
                    batch.dataIndex = null;
                }
            });
            return batch;
        }

    };


    module.exports = helper;



/***/ }),

/***/ 364:
/***/ (function(module, exports, __webpack_require__) {

/**
 * @file VisualMap preprocessor
 */


    var zrUtil = __webpack_require__(2);
    var each = zrUtil.each;

    module.exports = function (option) {
        var visualMap = option && option.visualMap;

        if (!zrUtil.isArray(visualMap)) {
            visualMap = visualMap ? [visualMap] : [];
        }

        each(visualMap, function (opt) {
            if (!opt) {
                return;
            }

            // rename splitList to pieces
            if (has(opt, 'splitList') && !has(opt, 'pieces')) {
                opt.pieces = opt.splitList;
                delete opt.splitList;
            }

            var pieces = opt.pieces;
            if (pieces && zrUtil.isArray(pieces)) {
                each(pieces, function (piece) {
                    if (zrUtil.isObject(piece)) {
                        if (has(piece, 'start') && !has(piece, 'min')) {
                            piece.min = piece.start;
                        }
                        if (has(piece, 'end') && !has(piece, 'max')) {
                            piece.max = piece.end;
                        }
                    }
                });
            }
        });
    };

    function has(obj, name) {
        return obj && obj.hasOwnProperty && obj.hasOwnProperty(name);
    }



/***/ }),

/***/ 365:
/***/ (function(module, exports, __webpack_require__) {



    __webpack_require__(80).registerSubTypeDefaulter('visualMap', function (option) {
        // Compatible with ec2, when splitNumber === 0, continuous visualMap will be used.
        return (
                !option.categories
                && (
                    !(
                        option.pieces
                            ? option.pieces.length > 0
                            : option.splitNumber > 0
                    )
                    || option.calculable
                )
            )
            ? 'continuous' : 'piecewise';
    });



/***/ }),

/***/ 366:
/***/ (function(module, exports, __webpack_require__) {

/**
 * @file Data range visual coding.
 */


    var echarts = __webpack_require__(10);
    var visualSolution = __webpack_require__(380);
    var VisualMapping = __webpack_require__(150);
    var zrUtil = __webpack_require__(2);

    echarts.registerVisual(echarts.PRIORITY.VISUAL.COMPONENT, function (ecModel) {
        ecModel.eachComponent('visualMap', function (visualMapModel) {
            processSingleVisualMap(visualMapModel, ecModel);
        });

        prepareVisualMeta(ecModel);
    });

    function processSingleVisualMap(visualMapModel, ecModel) {
        visualMapModel.eachTargetSeries(function (seriesModel) {
            var data = seriesModel.getData();

            visualSolution.applyVisual(
                visualMapModel.stateList,
                visualMapModel.targetVisuals,
                data,
                visualMapModel.getValueState,
                visualMapModel,
                visualMapModel.getDataDimension(data)
            );
        });
    }

    // Only support color.
    function prepareVisualMeta(ecModel) {
        ecModel.eachSeries(function (seriesModel) {
            var data = seriesModel.getData();
            var visualMetaList = [];

            ecModel.eachComponent('visualMap', function (visualMapModel) {
                if (visualMapModel.isTargetSeries(seriesModel)) {
                    var visualMeta = visualMapModel.getVisualMeta(
                        zrUtil.bind(getColorVisual, null, seriesModel, visualMapModel)
                    ) || {stops: [], outerColors: []};
                    visualMeta.dimension = visualMapModel.getDataDimension(data);
                    visualMetaList.push(visualMeta);
                }
            });

            // console.log(JSON.stringify(visualMetaList.map(a => a.stops)));
            seriesModel.getData().setVisual('visualMeta', visualMetaList);
        });
    }

    // FIXME
    // performance and export for heatmap?
    // value can be Infinity or -Infinity
    function getColorVisual(seriesModel, visualMapModel, value, valueState) {
        var mappings = visualMapModel.targetVisuals[valueState];
        var visualTypes = VisualMapping.prepareVisualTypes(mappings);
        var resultVisual = {
            color: seriesModel.getData().getVisual('color') // default color.
        };

        for (var i = 0, len = visualTypes.length; i < len; i++) {
            var type = visualTypes[i];
            var mapping = mappings[
                type === 'opacity' ? '__alphaForOpacity' : type
            ];
            mapping && mapping.applyVisual(value, getVisual, setVisual);
        }

        return resultVisual.color;

        function getVisual(key) {
            return resultVisual[key];
        }

        function setVisual(key, value) {
            resultVisual[key] = value;
        }
    }




/***/ }),

/***/ 367:
/***/ (function(module, exports, __webpack_require__) {

/**
 * @file Data range action
 */


    var echarts = __webpack_require__(10);

    var actionInfo = {
        type: 'selectDataRange',
        event: 'dataRangeSelected',
        // FIXME use updateView appears wrong
        update: 'update'
    };

    echarts.registerAction(actionInfo, function (payload, ecModel) {

        ecModel.eachComponent({mainType: 'visualMap', query: payload}, function (model) {
            model.setSelected(payload.selected);
        });

    });



/***/ }),

/***/ 372:
/***/ (function(module, exports, __webpack_require__) {

/**
 * @module echarts/coord/geo/Region
 */


    var polygonContain = __webpack_require__(1081);

    var BoundingRect = __webpack_require__(57);

    var bbox = __webpack_require__(510);
    var vec2 = __webpack_require__(43);

    /**
     * @param {string} name
     * @param {Array} geometries
     * @param {Array.<number>} cp
     */
    function Region(name, geometries, cp) {

        /**
         * @type {string}
         * @readOnly
         */
        this.name = name;

        /**
         * @type {Array.<Array>}
         * @readOnly
         */
        this.geometries = geometries;

        if (!cp) {
            var rect = this.getBoundingRect();
            cp = [
                rect.x + rect.width / 2,
                rect.y + rect.height / 2
            ];
        }
        else {
            cp = [cp[0], cp[1]];
        }
        /**
         * @type {Array.<number>}
         */
        this.center = cp;
    }

    Region.prototype = {

        constructor: Region,

        properties: null,

        /**
         * @return {module:zrender/core/BoundingRect}
         */
        getBoundingRect: function () {
            var rect = this._rect;
            if (rect) {
                return rect;
            }

            var MAX_NUMBER = Number.MAX_VALUE;
            var min = [MAX_NUMBER, MAX_NUMBER];
            var max = [-MAX_NUMBER, -MAX_NUMBER];
            var min2 = [];
            var max2 = [];
            var geometries = this.geometries;
            for (var i = 0; i < geometries.length; i++) {
                // Only support polygon
                if (geometries[i].type !== 'polygon') {
                    continue;
                }
                // Doesn't consider hole
                var exterior = geometries[i].exterior;
                bbox.fromPoints(exterior, min2, max2);
                vec2.min(min, min, min2);
                vec2.max(max, max, max2);
            }
            // No data
            if (i === 0) {
                min[0] = min[1] = max[0] = max[1] = 0;
            }

            return (this._rect = new BoundingRect(
                min[0], min[1], max[0] - min[0], max[1] - min[1]
            ));
        },

        /**
         * @param {<Array.<number>} coord
         * @return {boolean}
         */
        contain: function (coord) {
            var rect = this.getBoundingRect();
            var geometries = this.geometries;
            if (!rect.contain(coord[0], coord[1])) {
                return false;
            }
            loopGeo: for (var i = 0, len = geometries.length; i < len; i++) {
                // Only support polygon.
                if (geometries[i].type !== 'polygon') {
                    continue;
                }
                var exterior = geometries[i].exterior;
                var interiors = geometries[i].interiors;
                if (polygonContain.contain(exterior, coord[0], coord[1])) {
                    // Not in the region if point is in the hole.
                    for (var k = 0; k < (interiors ? interiors.length : 0); k++) {
                        if (polygonContain.contain(interiors[k])) {
                            continue loopGeo;
                        }
                    }
                    return true;
                }
            }
            return false;
        },

        transformTo: function (x, y, width, height) {
            var rect = this.getBoundingRect();
            var aspect = rect.width / rect.height;
            if (!width) {
                width = aspect * height;
            }
            else if (!height) {
                height = width / aspect ;
            }
            var target = new BoundingRect(x, y, width, height);
            var transform = rect.calculateTransform(target);
            var geometries = this.geometries;
            for (var i = 0; i < geometries.length; i++) {
                // Only support polygon.
                if (geometries[i].type !== 'polygon') {
                    continue;
                }
                var exterior = geometries[i].exterior;
                var interiors = geometries[i].interiors;
                for (var p = 0; p < exterior.length; p++) {
                    vec2.applyTransform(exterior[p], exterior[p], transform);
                }
                for (var h = 0; h < (interiors ? interiors.length : 0); h++) {
                    for (var p = 0; p < interiors[h].length; p++) {
                        vec2.applyTransform(interiors[h][p], interiors[h][p], transform);
                    }
                }
            }
            rect = this._rect;
            rect.copy(target);
            // Update center
            this.center = [
                rect.x + rect.width / 2,
                rect.y + rect.height / 2
            ];
        }
    };

    module.exports = Region;


/***/ }),

/***/ 373:
/***/ (function(module, exports, __webpack_require__) {



    var Geo = __webpack_require__(860);

    var layout = __webpack_require__(45);
    var zrUtil = __webpack_require__(2);
    var numberUtil = __webpack_require__(24);

    var mapDataStores = {};

    /**
     * Resize method bound to the geo
     * @param {module:echarts/coord/geo/GeoModel|module:echarts/chart/map/MapModel} geoModel
     * @param {module:echarts/ExtensionAPI} api
     */
    function resizeGeo (geoModel, api) {

        var boundingCoords = geoModel.get('boundingCoords');
        if (boundingCoords != null) {
            var leftTop = boundingCoords[0];
            var rightBottom = boundingCoords[1];
            if (isNaN(leftTop[0]) || isNaN(leftTop[1]) || isNaN(rightBottom[0]) || isNaN(rightBottom[1])) {
                if (__DEV__) {
                    console.error('Invalid boundingCoords');
                }
            }
            else {
                this.setBoundingRect(leftTop[0], leftTop[1], rightBottom[0] - leftTop[0], rightBottom[1] - leftTop[1]);
            }
        }

        var rect = this.getBoundingRect();

        var boxLayoutOption;

        var center = geoModel.get('layoutCenter');
        var size = geoModel.get('layoutSize');

        var viewWidth = api.getWidth();
        var viewHeight = api.getHeight();

        var aspectScale = geoModel.get('aspectScale') || 0.75;
        var aspect = rect.width / rect.height * aspectScale;

        var useCenterAndSize = false;

        if (center && size) {
            center = [
                numberUtil.parsePercent(center[0], viewWidth),
                numberUtil.parsePercent(center[1], viewHeight)
            ];
            size = numberUtil.parsePercent(size, Math.min(viewWidth, viewHeight));

            if (!isNaN(center[0]) && !isNaN(center[1]) && !isNaN(size)) {
                useCenterAndSize = true;
            }
            else {
                if (__DEV__) {
                    console.warn('Given layoutCenter or layoutSize data are invalid. Use left/top/width/height instead.');
                }
            }
        }

        var viewRect;
        if (useCenterAndSize) {
            var viewRect = {};
            if (aspect > 1) {
                // Width is same with size
                viewRect.width = size;
                viewRect.height = size / aspect;
            }
            else {
                viewRect.height = size;
                viewRect.width = size * aspect;
            }
            viewRect.y = center[1] - viewRect.height / 2;
            viewRect.x = center[0] - viewRect.width / 2;
        }
        else {
            // Use left/top/width/height
            boxLayoutOption = geoModel.getBoxLayoutParams();

            // 0.75 rate
            boxLayoutOption.aspect = aspect;

            viewRect = layout.getLayoutRect(boxLayoutOption, {
                width: viewWidth,
                height: viewHeight
            });
        }

        this.setViewRect(viewRect.x, viewRect.y, viewRect.width, viewRect.height);

        this.setCenter(geoModel.get('center'));
        this.setZoom(geoModel.get('zoom'));
    }

    /**
     * @param {module:echarts/coord/Geo} geo
     * @param {module:echarts/model/Model} model
     * @inner
     */
    function setGeoCoords(geo, model) {
        zrUtil.each(model.get('geoCoord'), function (geoCoord, name) {
            geo.addGeoCoord(name, geoCoord);
        });
    }

    if (__DEV__) {
        var mapNotExistsError = function (name) {
            console.error('Map ' + name + ' not exists. You can download map file on http://echarts.baidu.com/download-map.html');
        };
    }

    var geoCreator = {

        // For deciding which dimensions to use when creating list data
        dimensions: Geo.prototype.dimensions,

        create: function (ecModel, api) {
            var geoList = [];

            // FIXME Create each time may be slow
            ecModel.eachComponent('geo', function (geoModel, idx) {
                var name = geoModel.get('map');
                var mapData = mapDataStores[name];
                if (__DEV__) {
                    if (!mapData) {
                        mapNotExistsError(name);
                    }
                }
                var geo = new Geo(
                    name + idx, name,
                    mapData && mapData.geoJson, mapData && mapData.specialAreas,
                    geoModel.get('nameMap')
                );
                geo.zoomLimit = geoModel.get('scaleLimit');
                geoList.push(geo);

                setGeoCoords(geo, geoModel);

                geoModel.coordinateSystem = geo;
                geo.model = geoModel;

                // Inject resize method
                geo.resize = resizeGeo;

                geo.resize(geoModel, api);
            });

            ecModel.eachSeries(function (seriesModel) {
                var coordSys = seriesModel.get('coordinateSystem');
                if (coordSys === 'geo') {
                    var geoIndex = seriesModel.get('geoIndex') || 0;
                    seriesModel.coordinateSystem = geoList[geoIndex];
                }
            });

            // If has map series
            var mapModelGroupBySeries = {};

            ecModel.eachSeriesByType('map', function (seriesModel) {
                if (!seriesModel.getHostGeoModel()) {
                    var mapType = seriesModel.getMapType();
                    mapModelGroupBySeries[mapType] = mapModelGroupBySeries[mapType] || [];
                    mapModelGroupBySeries[mapType].push(seriesModel);
                }
            });

            zrUtil.each(mapModelGroupBySeries, function (mapSeries, mapType) {
                var mapData = mapDataStores[mapType];
                if (__DEV__) {
                    if (!mapData) {
                        mapNotExistsError(mapSeries[0].get('map'));
                    }
                }

                var nameMapList = zrUtil.map(mapSeries, function (singleMapSeries) {
                    return singleMapSeries.get('nameMap');
                });
                var geo = new Geo(
                    mapType, mapType,
                    mapData && mapData.geoJson, mapData && mapData.specialAreas,
                    zrUtil.mergeAll(nameMapList)
                );
                geo.zoomLimit = zrUtil.retrieve.apply(null, zrUtil.map(mapSeries, function (singleMapSeries) {
                    return singleMapSeries.get('scaleLimit');
                }));
                geoList.push(geo);

                // Inject resize method
                geo.resize = resizeGeo;

                geo.resize(mapSeries[0], api);

                zrUtil.each(mapSeries, function (singleMapSeries) {
                    singleMapSeries.coordinateSystem = geo;

                    setGeoCoords(geo, singleMapSeries);
                });
            });

            return geoList;
        },

        /**
         * @param {string} mapName
         * @param {Object|string} geoJson
         * @param {Object} [specialAreas]
         *
         * @example
         *     $.get('USA.json', function (geoJson) {
         *         echarts.registerMap('USA', geoJson);
         *         // Or
         *         echarts.registerMap('USA', {
         *             geoJson: geoJson,
         *             specialAreas: {}
         *         })
         *     });
         */
        registerMap: function (mapName, geoJson, specialAreas) {
            if (geoJson.geoJson && !geoJson.features) {
                specialAreas = geoJson.specialAreas;
                geoJson = geoJson.geoJson;
            }
            if (typeof geoJson === 'string') {
                geoJson = (typeof JSON !== 'undefined' && JSON.parse)
                    ? JSON.parse(geoJson) : (new Function('return (' + geoJson + ');'))();
            }
            mapDataStores[mapName] = {
                geoJson: geoJson,
                specialAreas: specialAreas
            };
        },

        /**
         * @param {string} mapName
         * @return {Object}
         */
        getMap: function (mapName) {
            return mapDataStores[mapName];
        },

        /**
         * Fill given regions array
         * @param  {Array.<Object>} originRegionArr
         * @param  {string} mapName
         * @param  {Object} [nameMap]
         * @return {Array}
         */
        getFilledRegions: function (originRegionArr, mapName, nameMap) {
            // Not use the original
            var regionsArr = (originRegionArr || []).slice();
            nameMap = nameMap || {};

            var map = geoCreator.getMap(mapName);
            var geoJson = map && map.geoJson;
            if (!geoJson) {
                if (__DEV__) {
                    mapNotExistsError(mapName);
                }
                return originRegionArr;
            }

            var dataNameMap = zrUtil.createHashMap();
            var features = geoJson.features;
            for (var i = 0; i < regionsArr.length; i++) {
                dataNameMap.set(regionsArr[i].name, regionsArr[i]);
            }

            for (var i = 0; i < features.length; i++) {
                var name = features[i].properties.name;
                if (!dataNameMap.get(name)) {
                    if (nameMap.hasOwnProperty(name)) {
                        name = nameMap[name];
                    }
                    regionsArr.push({
                        name: name
                    });
                }
            }
            return regionsArr;
        }
    };

    // Inject methods into echarts
    var echarts = __webpack_require__(10);

    echarts.registerMap = geoCreator.registerMap;

    echarts.getMap = geoCreator.getMap;

    echarts.parseGeoJSON = __webpack_require__(374);

    // TODO
    echarts.loadMap = function () {};

    echarts.registerCoordinateSystem('geo', geoCreator);

    module.exports = geoCreator;


/***/ }),

/***/ 374:
/***/ (function(module, exports, __webpack_require__) {

/**
 * Parse and decode geo json
 * @module echarts/coord/geo/parseGeoJson
 */


    var zrUtil = __webpack_require__(2);

    var Region = __webpack_require__(372);

    function decode(json) {
        if (!json.UTF8Encoding) {
            return json;
        }
        var encodeScale = json.UTF8Scale;
        if (encodeScale == null) {
            encodeScale = 1024;
        }

        var features = json.features;

        for (var f = 0; f < features.length; f++) {
            var feature = features[f];
            var geometry = feature.geometry;
            var coordinates = geometry.coordinates;
            var encodeOffsets = geometry.encodeOffsets;

            for (var c = 0; c < coordinates.length; c++) {
                var coordinate = coordinates[c];

                if (geometry.type === 'Polygon') {
                    coordinates[c] = decodePolygon(
                        coordinate,
                        encodeOffsets[c],
                        encodeScale
                    );
                }
                else if (geometry.type === 'MultiPolygon') {
                    for (var c2 = 0; c2 < coordinate.length; c2++) {
                        var polygon = coordinate[c2];
                        coordinate[c2] = decodePolygon(
                            polygon,
                            encodeOffsets[c][c2],
                            encodeScale
                        );
                    }
                }
            }
        }
        // Has been decoded
        json.UTF8Encoding = false;
        return json;
    }

    function decodePolygon(coordinate, encodeOffsets, encodeScale) {
        var result = [];
        var prevX = encodeOffsets[0];
        var prevY = encodeOffsets[1];

        for (var i = 0; i < coordinate.length; i += 2) {
            var x = coordinate.charCodeAt(i) - 64;
            var y = coordinate.charCodeAt(i + 1) - 64;
            // ZigZag decoding
            x = (x >> 1) ^ (-(x & 1));
            y = (y >> 1) ^ (-(y & 1));
            // Delta deocding
            x += prevX;
            y += prevY;

            prevX = x;
            prevY = y;
            // Dequantize
            result.push([x / encodeScale, y / encodeScale]);
        }

        return result;
    }

    /**
     * @alias module:echarts/coord/geo/parseGeoJson
     * @param {Object} geoJson
     * @return {module:zrender/container/Group}
     */
    module.exports = function (geoJson) {

        decode(geoJson);

        return zrUtil.map(zrUtil.filter(geoJson.features, function (featureObj) {
            // Output of mapshaper may have geometry null
            return featureObj.geometry
                && featureObj.properties
                && featureObj.geometry.coordinates.length > 0;
        }), function (featureObj) {
            var properties = featureObj.properties;
            var geo = featureObj.geometry;

            var coordinates = geo.coordinates;

            var geometries = [];
            if (geo.type === 'Polygon') {
                geometries.push({
                    type: 'polygon',
                    // According to the GeoJSON specification.
                    // First must be exterior, and the rest are all interior(holes).
                    exterior: coordinates[0],
                    interiors: coordinates.slice(1)
                });
            }
            if (geo.type === 'MultiPolygon') {
                zrUtil.each(coordinates, function (item) {
                    if (item[0]) {
                        geometries.push({
                            type: 'polygon',
                            exterior: item[0],
                            interiors: item.slice(1)
                        });
                    }
                });
            }

            var region = new Region(
                properties.name,
                geometries,
                properties.cp
            );
            region.properties = properties;
            return region;
        });
    };


/***/ }),

/***/ 379:
/***/ (function(module, exports, __webpack_require__) {

/**
 * @file Visual mapping.
 */


    var zrUtil = __webpack_require__(2);

    var visualDefault = {

        /**
         * @public
         */
        get: function (visualType, key, isCategory) {
            var value = zrUtil.clone(
                (defaultOption[visualType] || {})[key]
            );

            return isCategory
                ? (zrUtil.isArray(value) ? value[value.length - 1] : value)
                : value;
        }

    };

    var defaultOption = {

        color: {
            active: ['#006edd', '#e0ffff'],
            inactive: ['rgba(0,0,0,0)']
        },

        colorHue: {
            active: [0, 360],
            inactive: [0, 0]
        },

        colorSaturation: {
            active: [0.3, 1],
            inactive: [0, 0]
        },

        colorLightness: {
            active: [0.9, 0.5],
            inactive: [0, 0]
        },

        colorAlpha: {
            active: [0.3, 1],
            inactive: [0, 0]
        },

        opacity: {
            active: [0.3, 1],
            inactive: [0, 0]
        },

        symbol: {
            active: ['circle', 'roundRect', 'diamond'],
            inactive: ['none']
        },

        symbolSize: {
            active: [10, 50],
            inactive: [0, 0]
        }
    };

    module.exports = visualDefault;




/***/ }),

/***/ 380:
/***/ (function(module, exports, __webpack_require__) {

/**
 * @file Visual solution, for consistent option specification.
 */


    var zrUtil = __webpack_require__(2);
    var VisualMapping = __webpack_require__(150);
    var each = zrUtil.each;

    function hasKeys(obj) {
        if (obj) {
            for (var name in obj){
                if (obj.hasOwnProperty(name)) {
                    return true;
                }
            }
        }
    }

    var visualSolution = {

        /**
         * @param {Object} option
         * @param {Array.<string>} stateList
         * @param {Function} [supplementVisualOption]
         * @return {Object} visualMappings <state, <visualType, module:echarts/visual/VisualMapping>>
         */
        createVisualMappings: function (option, stateList, supplementVisualOption) {
            var visualMappings = {};

            each(stateList, function (state) {
                var mappings = visualMappings[state] = createMappings();

                each(option[state], function (visualData, visualType) {
                    if (!VisualMapping.isValidType(visualType)) {
                        return;
                    }
                    var mappingOption = {
                        type: visualType,
                        visual: visualData
                    };
                    supplementVisualOption && supplementVisualOption(mappingOption, state);
                    mappings[visualType] = new VisualMapping(mappingOption);

                    // Prepare a alpha for opacity, for some case that opacity
                    // is not supported, such as rendering using gradient color.
                    if (visualType === 'opacity') {
                        mappingOption = zrUtil.clone(mappingOption);
                        mappingOption.type = 'colorAlpha';
                        mappings.__hidden.__alphaForOpacity = new VisualMapping(mappingOption);
                    }
                });
            });

            return visualMappings;

            function createMappings() {
                var Creater = function () {};
                // Make sure hidden fields will not be visited by
                // object iteration (with hasOwnProperty checking).
                Creater.prototype.__hidden = Creater.prototype;
                var obj = new Creater();
                return obj;
            }
        },

        /**
         * @param {Object} thisOption
         * @param {Object} newOption
         * @param {Array.<string>} keys
         */
        replaceVisualOption: function (thisOption, newOption, keys) {
            // Visual attributes merge is not supported, otherwise it
            // brings overcomplicated merge logic. See #2853. So if
            // newOption has anyone of these keys, all of these keys
            // will be reset. Otherwise, all keys remain.
            var has;
            zrUtil.each(keys, function (key) {
                if (newOption.hasOwnProperty(key) && hasKeys(newOption[key])) {
                    has = true;
                }
            });
            has && zrUtil.each(keys, function (key) {
                if (newOption.hasOwnProperty(key) && hasKeys(newOption[key])) {
                    thisOption[key] = zrUtil.clone(newOption[key]);
                }
                else {
                    delete thisOption[key];
                }
            });
        },

        /**
         * @param {Array.<string>} stateList
         * @param {Object} visualMappings <state, Object.<visualType, module:echarts/visual/VisualMapping>>
         * @param {module:echarts/data/List} list
         * @param {Function} getValueState param: valueOrIndex, return: state.
         * @param {object} [scope] Scope for getValueState
         * @param {string} [dimension] Concrete dimension, if used.
         */
        applyVisual: function (stateList, visualMappings, data, getValueState, scope, dimension) {
            var visualTypesMap = {};
            zrUtil.each(stateList, function (state) {
                var visualTypes = VisualMapping.prepareVisualTypes(visualMappings[state]);
                visualTypesMap[state] = visualTypes;
            });

            var dataIndex;

            function getVisual(key) {
                return data.getItemVisual(dataIndex, key);
            }

            function setVisual(key, value) {
                data.setItemVisual(dataIndex, key, value);
            }

            if (dimension == null) {
                data.each(eachItem, true);
            }
            else {
                data.each([dimension], eachItem, true);
            }

            function eachItem(valueOrIndex, index) {
                dataIndex = dimension == null ? valueOrIndex : index;

                var rawDataItem = data.getRawDataItem(dataIndex);
                // Consider performance
                if (rawDataItem && rawDataItem.visualMap === false) {
                    return;
                }

                var valueState = getValueState.call(scope, valueOrIndex);
                var mappings = visualMappings[valueState];
                var visualTypes = visualTypesMap[valueState];

                for (var i = 0, len = visualTypes.length; i < len; i++) {
                    var type = visualTypes[i];
                    mappings[type] && mappings[type].applyVisual(
                        valueOrIndex, getVisual, setVisual
                    );
                }
            }
        }
    };

    module.exports = visualSolution;



/***/ }),

/***/ 566:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(5);
var spssUtils_1 = __webpack_require__(87);
var new_table_1 = __webpack_require__(7);
var echarts = __webpack_require__(10);
var chinaJson = __webpack_require__(1105);
// import 'echarts/lib/chart/bar';
// import 'echarts/lib/chart/line';
__webpack_require__(142);
__webpack_require__(804);
__webpack_require__(122);
// import 'echarts/lib/component/title';
__webpack_require__(133);
__webpack_require__(846);
__webpack_require__(120);
__webpack_require__(951);
var StatisticsUserIndex;
(function (StatisticsUserIndex) {
    var chart;
    var map;
    var rankTable;
    var datePicker;
    var recordT;
    var recordTable;
    $(function () {
        init();
    });
    function init() {
        spssUtils_1.initTip([{
                el: $('#source-tip'),
                content: "\n\t\t\t\u7EDF\u8BA1\u6765\u81EA\u4E0D\u540C\u6E20\u9053\u7684\u7528\u6237\u5360\u6BD4\n\t\t\t"
            }, {
                el: $('#distribute-tip'),
                content: "\n\t\t\t\u7EDF\u8BA1\u5404\u7701\u4EFD\u7684\u6765\u8BBF\u7528\u6237\u5206\u5E03\u60C5\u51B5\n\t\t\t"
            }, {
                el: $('#rank-tip'),
                content: "\n\t\t\t\u7EDF\u8BA1\u5404\u7701\u4EFD\u7684\u6765\u8BBF\u7528\u6237\u6570\u91CF\u548C\u5360\u6BD4\n\t\t\t"
            }]);
        bindTabEvent();
        initDatePicker();
        initTableData();
        initCharts();
        initTable();
    }
    function initTableData() {
        var newData = new Date();
        var latestDate = new Date(newData);
        var threeMonthBefore = new Date(newData - 30 * 3 * 24 * 60 * 60 * 1000);
        new utils_1.CommonDate({
            el: $('#form-date'),
            options: {
                startDate: threeMonthBefore,
                endDate: latestDate
            }
        });
    }
    function bindTabEvent() {
        $('a[href="#userRecord"]').on('shown.bs.tab', function () {
            if (recordTable) {
                recordTable.reload();
                return;
            }
            initRecordTable();
        });
    }
    function initRecordTable() {
        recordTable = new new_table_1.Table({
            el: $('#record-table'),
            options: {
                paging: true,
                serverSide: true,
                ajax: {
                    type: 'POST',
                    url: 'spss/userData/pageUserInfoByParam',
                    dataSrc: function (data) { return data.rows; },
                    data: function (d) {
                        var time = $('#form-date').val().split(' - '), data = {
                            page: Math.floor((d.start + d.length) / d.length),
                            rows: d.length,
                            beginTime: time[0],
                            endTime: time[1],
                            userName: $.trim($('#user').val()),
                            degree: $.trim($('#satisfy').val()),
                            sessiones: $.trim($('#talk-number').val())
                        };
                        return utils_1.cleanObject(data);
                    }
                },
                initComplete: bindRecordEvent,
                columns: [
                    { data: 'userName', createdCell: new_table_1.createAddTitle, title: '用户' },
                    { data: 'sessiones', width: '45', title: '会话数' },
                    { data: 'vistorSendMsg', width: '45', title: '问题数' },
                    { data: 'servicerSendMsg', title: '人工客服回复数' },
                    { data: 'robotSendMsg', title: '机器人回复数' },
                    { data: 'hasNoAnswer', title: '未匹配问题数<i class="table-tip fa fa-question-circle" id="hasno-tip"></i>' },
                    { data: 'satify', title: '用户满意率<i class="table-tip fa fa-question-circle" id="satisfy-tip"></i>', render: utils_1.renderPercent },
                    { data: 'firstSessionTime', title: '首次会话时间', width: '126', render: utils_1.renderCommonTime },
                    { data: 'lastSessionTime', title: '最后会话时间', width: '126', render: utils_1.renderCommonTime },
                    {
                        data: 'userName', title: '操作', width: '30', render: function (userName, status, rowData) {
                            return "<div data-starttime=\"" + rowData.firstSessionTime + "\" data-endtime=\"" + rowData.lastSessionTime + "\" data-userName=\"" + userName + "\" class=\"cloud-image-icon\"><img src=\"images/chart2.png\" class=\"view-detail\" title=\"\u67E5\u770B\u4F1A\u8BDD\u8BB0\u5F55\"/></div>";
                        }
                    }
                ]
            }
        });
    }
    function bindRecordEvent() {
        spssUtils_1.initTip([{
                el: $('#hasno-tip'),
                content: "\n\t\t\t\u673A\u5668\u4EBA\u672A\u5339\u914D\u5230\u7B54\u6848\u7684\u95EE\u9898\u6570\n\t\t\t"
            }, {
                el: $('#satisfy-tip'),
                content: "\n\t\t\t\u88AB\u7528\u6237\u8BC4\u4EF7\u4E3A\u6EE1\u610F\u548C\u975E\u5E38\u6EE1\u610F\u7684\u4F1A\u8BDD\u5728\u6240\u6709\u4F1A\u8BDD\u4E2D\u7684\u5360\u6BD4\n\t\t\t"
            }]);
        $('#export').on('click', function () {
            var href = "spss/userData/exportUserInfoExcel?" + $.param(recordTable.dt.ajax.params());
            window.open(href);
        });
        var tableEl = $('#record-table');
        $('#search-btn').on('click', function () {
            recordTable.reload();
        });
        tableEl.on('click', '.view-detail', function () {
            var data = $(this).parent().data();
            window.open("spss/sessionLog/index?userName=" + data.username + "&startTime=" + data.starttime + "&endTime=" + data.endtime);
        });
    }
    function initDatePicker() {
        var el = $('.spss-time-container .date-range-picker');
        datePicker = new spssUtils_1.SpssBtnDate({
            el: el,
            onClick: function (mode, date) {
                drawChart();
                drawTable();
            }
        });
    }
    function initCharts() {
        echarts.registerMap('china', chinaJson);
        chart = echarts.init(document.getElementById('chart'));
        map = echarts.init(document.getElementById('map'));
        drawChart();
    }
    function drawChart() {
        getChartData(function (data) {
            chart.setOption(getOp(data));
        });
        getMapData(function (data) {
            map.setOption(getMapOp(data));
        });
    }
    function drawTable() {
        rankTable.reload();
        // $.ajax({
        // 	url: 'spss/userData/arealRanking',
        // 	method: 'GET',
        // 	data: {
        // 		mode: datePicker.mode,
        // 		startDay: datePicker.date.startDay,
        // 		endDay: datePicker.date.endDay,
        // 		page: 1,
        // 		size: 100
        // 	}
        // }).done((data) => {
        // 	const newData = data.map((v, i) => {
        // 		return {
        // 			...v,
        // 			rank: i + 1
        // 		};
        // 	});
        // 	if (!rankTable) {
        // 		const table = $('#percent-table').DataTable(
        // 			{
        // 				data: newData,
        // 				scrollY: '300px',
        // 				serverSide: false,
        // 				select: 'single',
        // 				info: false,
        // 				columns: [
        // 					{ data: 'rank', title: '排名' },
        // 					{ data: 'categoryName', title: '分类' },
        // 					{ data: 'sum', title: '次数' },
        // 					{ data: 'rate', title: '占比' }
        // 				]
        // 			});
        // 		rankTable = new Table(table);
        // 	} else {
        // 		rankTable.table.rows().remove();
        // 		rankTable.table.rows.add(newData);
        // 		rankTable.table.draw();
        // 	}
        // });
    }
    function initTable() {
        rankTable = new new_table_1.Table({
            el: $('#area-rank-table'),
            options: {
                paging: true,
                scrollY: '300px',
                ajax: {
                    type: 'POST',
                    url: 'spss/userData/arealRanking',
                    dataSrc: function (data) { return data.rows; },
                    data: function (d) {
                        var data = {
                            page: Math.floor((d.start + d.length) / d.length),
                            rows: d.length,
                            mode: datePicker.mode,
                            startDay: datePicker.date.startDay,
                            endDay: datePicker.date.endDay
                        };
                        return utils_1.cleanObject(data);
                    }
                },
                serverSide: true,
                columns: [
                    { data: 'no', title: '排名' },
                    { data: 'name', title: '分类' },
                    { data: 'value', title: '次数' },
                    { data: 'rate', title: '占比', render: utils_1.renderPercent }
                ],
                initComplete: bindRecordEvent
            }
        });
    }
    function getChartData(cb) {
        $.ajax({
            url: 'spss/userData/userSource',
            method: 'GET',
            data: {
                mode: datePicker.mode,
                startDay: datePicker.date.startDay,
                endDay: datePicker.date.endDay
            }
        }).done(function (data) {
            cb(data);
        });
    }
    function getMapData(cb) {
        $.ajax({
            url: 'spss/userData/arealDistribute',
            method: 'GET',
            data: {
                mode: datePicker.mode,
                startDay: datePicker.date.startDay,
                endDay: datePicker.date.endDay
            }
        }).done(function (data) {
            cb(data);
        });
    }
    function getOp(data) {
        return {
            color: ['#ffb000', '#37a6e7', '#4caf50'],
            series: {
                data: data,
                name: '用户来源',
                type: 'pie',
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            },
            toolbox: {
                right: 50,
                feature: {
                    saveAsImage: {}
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['微信', '移动应用', 'PC网页']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            }
        };
    }
    function getMapOp(data) {
        var option = {
            color: ['#ffb000'],
            title: {
                text: 'iphone销量',
                subtext: '纯属虚构',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            visualMap: {
                inRange: {
                    color: ['#d7e2f5', '#3159a4']
                },
                min: 0,
                max: 2500,
                left: 'left',
                top: 'bottom',
                text: ['高', '低'],
                calculable: true
            },
            toolbox: {
                right: 40,
                show: true,
                orient: 'vertical',
                top: 'center',
                feature: {
                    restore: {},
                    saveAsImage: {}
                },
                iconStyle: {
                    normal: {
                        textAlign: 'right',
                        textPosition: 'left'
                    },
                    emphasis: {
                        textAlign: 'right',
                        textPosition: 'left'
                    }
                }
            },
            series: [
                {
                    data: data,
                    name: '用户',
                    type: 'map',
                    mapType: 'china',
                    roam: false,
                    label: {
                        normal: {
                            textStyle: {
                                color: '#8b5839'
                            },
                            show: true
                        },
                        emphasis: {
                            textStyle: {
                                color: '#8b5839'
                            },
                            show: true
                        }
                    },
                    itemStyle: {
                        emphasis: {
                            areaColor: '#f2da6b'
                        }
                    }
                }
            ]
        };
        return option;
    }
})(StatisticsUserIndex || (StatisticsUserIndex = {}));


/***/ }),

/***/ 790:
/***/ (function(module, exports, __webpack_require__) {



    var zrUtil = __webpack_require__(2);
    var roamHelper = __webpack_require__(791);

    var echarts = __webpack_require__(10);

    /**
     * @payload
     * @property {string} [componentType=series]
     * @property {number} [dx]
     * @property {number} [dy]
     * @property {number} [zoom]
     * @property {number} [originX]
     * @property {number} [originY]
     */
    echarts.registerAction({
        type: 'geoRoam',
        event: 'geoRoam',
        update: 'updateLayout'
    }, function (payload, ecModel) {
        var componentType = payload.componentType || 'series';

        ecModel.eachComponent(
            { mainType: componentType, query: payload },
            function (componentModel) {
                var geo = componentModel.coordinateSystem;
                if (geo.type !== 'geo') {
                    return;
                }

                var res = roamHelper.updateCenterAndZoom(
                    geo, payload, componentModel.get('scaleLimit')
                );

                componentModel.setCenter
                    && componentModel.setCenter(res.center);

                componentModel.setZoom
                    && componentModel.setZoom(res.zoom);

                // All map series with same `map` use the same geo coordinate system
                // So the center and zoom must be in sync. Include the series not selected by legend
                if (componentType === 'series') {
                    zrUtil.each(componentModel.seriesGroup, function (seriesModel) {
                        seriesModel.setCenter(res.center);
                        seriesModel.setZoom(res.zoom);
                    });
                }
            }
        );
    });


/***/ }),

/***/ 791:
/***/ (function(module, exports) {



    var roamHelper = {};

    /**
     * @param {module:echarts/coord/View} view
     * @param {Object} payload
     * @param {Object} [zoomLimit]
     */
    roamHelper.updateCenterAndZoom = function (
        view, payload, zoomLimit
    ) {
        var previousZoom = view.getZoom();
        var center = view.getCenter();
        var zoom = payload.zoom;

        var point = view.dataToPoint(center);

        if (payload.dx != null && payload.dy != null) {
            point[0] -= payload.dx;
            point[1] -= payload.dy;

            var center = view.pointToData(point);
            view.setCenter(center);
        }
        if (zoom != null) {
            if (zoomLimit) {
                var zoomMin = zoomLimit.min || 0;
                var zoomMax = zoomLimit.max || Infinity;
                zoom = Math.max(
                    Math.min(previousZoom * zoom, zoomMax),
                    zoomMin
                ) / previousZoom;
            }

            // Zoom on given point(originX, originY)
            view.scale[0] *= zoom;
            view.scale[1] *= zoom;
            var position = view.position;
            var fixX = (payload.originX - position[0]) * (zoom - 1);
            var fixY = (payload.originY - position[1]) * (zoom - 1);

            position[0] -= fixX;
            position[1] -= fixY;

            view.updateTransform();
            // Get the new center
            var center = view.pointToData(point);
            view.setCenter(center);
            view.setZoom(zoom * previousZoom);
        }

        return {
            center: view.getCenter(),
            zoom: view.getZoom()
        };
    };

    module.exports = roamHelper;


/***/ }),

/***/ 804:
/***/ (function(module, exports, __webpack_require__) {



    var echarts = __webpack_require__(10);
    var PRIORITY = echarts.PRIORITY;

    __webpack_require__(805);

    __webpack_require__(806);

    __webpack_require__(790);

    __webpack_require__(373);

    echarts.registerLayout(__webpack_require__(809));

    echarts.registerVisual(__webpack_require__(810));

    echarts.registerProcessor(PRIORITY.PROCESSOR.STATISTIC, __webpack_require__(808));

    echarts.registerPreprocessor(__webpack_require__(807));

    __webpack_require__(130)('map', [{
        type: 'mapToggleSelect',
        event: 'mapselectchanged',
        method: 'toggleSelected'
    }, {
        type: 'mapSelect',
        event: 'mapselected',
        method: 'select'
    }, {
        type: 'mapUnSelect',
        event: 'mapunselected',
        method: 'unSelect'
    }]);


/***/ }),

/***/ 805:
/***/ (function(module, exports, __webpack_require__) {



    var List = __webpack_require__(135);
    var SeriesModel = __webpack_require__(247);
    var zrUtil = __webpack_require__(2);
    var completeDimensions = __webpack_require__(136);

    var formatUtil = __webpack_require__(46);
    var encodeHTML = formatUtil.encodeHTML;
    var addCommas = formatUtil.addCommas;

    var dataSelectableMixin = __webpack_require__(132);

    var geoCreator = __webpack_require__(373);

    var MapSeries = SeriesModel.extend({

        type: 'series.map',

        dependencies: ['geo'],

        layoutMode: 'box',

        /**
         * Only first map series of same mapType will drawMap
         * @type {boolean}
         */
        needsDrawMap: false,

        /**
         * Group of all map series with same mapType
         * @type {boolean}
         */
        seriesGroup: [],

        init: function (option) {

            option = this._fillOption(option, this.getMapType());
            this.option = option;

            MapSeries.superApply(this, 'init', arguments);

            this.updateSelectedMap(option.data);
        },

        getInitialData: function (option) {
            var dimensions = completeDimensions(['value'], option.data || []);

            var list = new List(dimensions, this);

            list.initData(option.data);

            return list;
        },

        mergeOption: function (newOption) {
            if (newOption.data) {
                newOption = this._fillOption(newOption, this.getMapType());
            }

            MapSeries.superCall(this, 'mergeOption', newOption);

            this.updateSelectedMap(this.option.data);
        },

        /**
         * If no host geo model, return null, which means using a
         * inner exclusive geo model.
         */
        getHostGeoModel: function () {
            var geoIndex = this.option.geoIndex;
            return geoIndex != null
                ? this.dependentModels.geo[geoIndex]
                : null;
        },

        getMapType: function () {
            return (this.getHostGeoModel() || this).option.map;
        },

        _fillOption: function (option, mapName) {
            // Shallow clone
            option = zrUtil.extend({}, option);

            option.data = geoCreator.getFilledRegions(option.data, mapName, option.nameMap);

            return option;
        },

        getRawValue: function (dataIndex) {
            // Use value stored in data instead because it is calculated from multiple series
            // FIXME Provide all value of multiple series ?
            return this.getData().get('value', dataIndex);
        },

        /**
         * Get model of region
         * @param  {string} name
         * @return {module:echarts/model/Model}
         */
        getRegionModel: function (regionName) {
            var data = this.getData();
            return data.getItemModel(data.indexOfName(regionName));
        },

        /**
         * Map tooltip formatter
         *
         * @param {number} dataIndex
         */
        formatTooltip: function (dataIndex) {
            // FIXME orignalData and data is a bit confusing
            var data = this.getData();
            var formattedValue = addCommas(this.getRawValue(dataIndex));
            var name = data.getName(dataIndex);

            var seriesGroup = this.seriesGroup;
            var seriesNames = [];
            for (var i = 0; i < seriesGroup.length; i++) {
                var otherIndex = seriesGroup[i].originalData.indexOfName(name);
                if (!isNaN(seriesGroup[i].originalData.get('value', otherIndex))) {
                    seriesNames.push(
                        encodeHTML(seriesGroup[i].name)
                    );
                }
            }

            return seriesNames.join(', ') + '<br />'
                + encodeHTML(name + ' : ' + formattedValue);
        },

        /**
         * @implement
         */
        getTooltipPosition: function (dataIndex) {
            if (dataIndex != null) {
                var name = this.getData().getName(dataIndex);
                var geo = this.coordinateSystem;
                var region = geo.getRegion(name);

                return region && geo.dataToPoint(region.center);
            }
        },

        setZoom: function (zoom) {
            this.option.zoom = zoom;
        },

        setCenter: function (center) {
            this.option.center = center;
        },

        defaultOption: {
            // 一级层叠
            zlevel: 0,
            // 二级层叠
            z: 2,

            coordinateSystem: 'geo',

            // map should be explicitly specified since ec3.
            map: '',

            // If `geoIndex` is not specified, a exclusive geo will be
            // created. Otherwise use the specified geo component, and
            // `map` and `mapType` are ignored.
            // geoIndex: 0,

            // 'center' | 'left' | 'right' | 'x%' | {number}
            left: 'center',
            // 'center' | 'top' | 'bottom' | 'x%' | {number}
            top: 'center',
            // right
            // bottom
            // width:
            // height

            // Aspect is width / height. Inited to be geoJson bbox aspect
            // This parameter is used for scale this aspect
            aspectScale: 0.75,

            ///// Layout with center and size
            // If you wan't to put map in a fixed size box with right aspect ratio
            // This two properties may more conveninet
            // layoutCenter: [50%, 50%]
            // layoutSize: 100


            // 数值合并方式，默认加和，可选为：
            // 'sum' | 'average' | 'max' | 'min'
            // mapValueCalculation: 'sum',
            // 地图数值计算结果小数精度
            // mapValuePrecision: 0,


            // 显示图例颜色标识（系列标识的小圆点），图例开启时有效
            showLegendSymbol: true,
            // 选择模式，默认关闭，可选single，multiple
            // selectedMode: false,
            dataRangeHoverLink: true,
            // 是否开启缩放及漫游模式
            // roam: false,

            // Define left-top, right-bottom coords to control view
            // For example, [ [180, 90], [-180, -90] ],
            // higher priority than center and zoom
            boundingCoords: null,

            // Default on center of map
            center: null,

            zoom: 1,

            scaleLimit: null,

            label: {
                normal: {
                    show: false,
                    color: '#000'
                },
                emphasis: {
                    show: true,
                    color: 'rgb(100,0,0)'
                }
            },
            // scaleLimit: null,
            itemStyle: {
                normal: {
                    // color: 各异,
                    borderWidth: 0.5,
                    borderColor: '#444',
                    areaColor: '#eee'
                },
                // 也是选中样式
                emphasis: {
                    areaColor: 'rgba(255,215,0,0.8)'
                }
            }
        }

    });

    zrUtil.mixin(MapSeries, dataSelectableMixin);

    module.exports = MapSeries;


/***/ }),

/***/ 806:
/***/ (function(module, exports, __webpack_require__) {



    // var zrUtil = require('zrender/lib/core/util');
    var graphic = __webpack_require__(17);
    var zrUtil = __webpack_require__(2);

    var MapDraw = __webpack_require__(828);

    __webpack_require__(10).extendChartView({

        type: 'map',

        render: function (mapModel, ecModel, api, payload) {
            // Not render if it is an toggleSelect action from self
            if (payload && payload.type === 'mapToggleSelect'
                && payload.from === this.uid
            ) {
                return;
            }

            var group = this.group;
            group.removeAll();

            if (mapModel.getHostGeoModel()) {
                return;
            }

            // Not update map if it is an roam action from self
            if (!(payload && payload.type === 'geoRoam'
                    && payload.componentType === 'series'
                    && payload.seriesId === mapModel.id
                )
            ) {
                if (mapModel.needsDrawMap) {
                    var mapDraw = this._mapDraw || new MapDraw(api, true);
                    group.add(mapDraw.group);

                    mapDraw.draw(mapModel, ecModel, api, this, payload);

                    this._mapDraw = mapDraw;
                }
                else {
                    // Remove drawed map
                    this._mapDraw && this._mapDraw.remove();
                    this._mapDraw = null;
                }
            }
            else {
                var mapDraw = this._mapDraw;
                mapDraw && group.add(mapDraw.group);
            }

            mapModel.get('showLegendSymbol') && ecModel.getComponent('legend')
                && this._renderSymbols(mapModel, ecModel, api);
        },

        remove: function () {
            this._mapDraw && this._mapDraw.remove();
            this._mapDraw = null;
            this.group.removeAll();
        },

        dispose: function () {
            this._mapDraw && this._mapDraw.remove();
            this._mapDraw = null;
        },

        _renderSymbols: function (mapModel, ecModel, api) {
            var originalData = mapModel.originalData;
            var group = this.group;

            originalData.each('value', function (value, idx) {
                if (isNaN(value)) {
                    return;
                }

                var layout = originalData.getItemLayout(idx);

                if (!layout || !layout.point) {
                    // Not exists in map
                    return;
                }

                var point = layout.point;
                var offset = layout.offset;

                var circle = new graphic.Circle({
                    style: {
                        // Because the special of map draw.
                        // Which needs statistic of multiple series and draw on one map.
                        // And each series also need a symbol with legend color
                        //
                        // Layout and visual are put one the different data
                        fill: mapModel.getData().getVisual('color')
                    },
                    shape: {
                        cx: point[0] + offset * 9,
                        cy: point[1],
                        r: 3
                    },
                    silent: true,
                    // Do not overlap the first series, on which labels are displayed.
                    z2: !offset ? 10 : 8
                });

                // First data on the same region
                if (!offset) {
                    var fullData = mapModel.mainSeries.getData();
                    var name = originalData.getName(idx);

                    var fullIndex = fullData.indexOfName(name);

                    var itemModel = originalData.getItemModel(idx);
                    var labelModel = itemModel.getModel('label.normal');
                    var hoverLabelModel = itemModel.getModel('label.emphasis');

                    var polygonGroups = fullData.getItemGraphicEl(fullIndex);

                    var normalText = zrUtil.retrieve2(
                        mapModel.getFormattedLabel(idx, 'normal'),
                        name
                    );
                    var emphasisText = zrUtil.retrieve2(
                        mapModel.getFormattedLabel(idx, 'emphasis'),
                        normalText
                    );

                    var onEmphasis = function () {
                        var hoverStyle = graphic.setTextStyle({}, hoverLabelModel, {
                            text: hoverLabelModel.get('show') ? emphasisText : null
                        }, {isRectText: true, useInsideStyle: false}, true);
                        circle.style.extendFrom(hoverStyle);
                        // Make label upper than others if overlaps.
                        circle.__mapOriginalZ2 = circle.z2;
                        circle.z2 += 1;
                    };

                    var onNormal = function () {
                        graphic.setTextStyle(circle.style, labelModel, {
                            text: labelModel.get('show') ? normalText : null,
                            textPosition: labelModel.getShallow('position') || 'bottom'
                        }, {isRectText: true, useInsideStyle: false});

                        if (circle.__mapOriginalZ2 != null) {
                            circle.z2 = circle.__mapOriginalZ2;
                            circle.__mapOriginalZ2 = null;
                        }
                    };

                    polygonGroups.on('mouseover', onEmphasis)
                        .on('mouseout', onNormal)
                        .on('emphasis', onEmphasis)
                        .on('normal', onNormal);

                    onNormal();
                }

                group.add(circle);
            });
        }
    });


/***/ }),

/***/ 807:
/***/ (function(module, exports, __webpack_require__) {



    var zrUtil = __webpack_require__(2);

    module.exports = function (option) {
        // Save geoCoord
        var mapSeries = [];
        zrUtil.each(option.series, function (seriesOpt) {
            if (seriesOpt.type === 'map') {
                mapSeries.push(seriesOpt);
            }
        });

        zrUtil.each(mapSeries, function (seriesOpt) {
            seriesOpt.map = seriesOpt.map || seriesOpt.mapType;
            // Put x, y, width, height, x2, y2 in the top level
            zrUtil.defaults(seriesOpt, seriesOpt.mapLocation);
        });
    };


/***/ }),

/***/ 808:
/***/ (function(module, exports, __webpack_require__) {



    var zrUtil = __webpack_require__(2);

    // FIXME 公用？
    /**
     * @param {Array.<module:echarts/data/List>} datas
     * @param {string} statisticType 'average' 'sum'
     * @inner
     */
    function dataStatistics(datas, statisticType) {
        var dataNameMap = {};
        var dims = ['value'];

        zrUtil.each(datas, function (data) {
            data.each(dims, function (value, idx) {
                // Add prefix to avoid conflict with Object.prototype.
                var mapKey = 'ec-' + data.getName(idx);
                dataNameMap[mapKey] = dataNameMap[mapKey] || [];
                if (!isNaN(value)) {
                    dataNameMap[mapKey].push(value);
                }
            });
        });

        return datas[0].map(dims, function (value, idx) {
            var mapKey = 'ec-' + datas[0].getName(idx);
            var sum = 0;
            var min = Infinity;
            var max = -Infinity;
            var len = dataNameMap[mapKey].length;
            for (var i = 0; i < len; i++) {
                min = Math.min(min, dataNameMap[mapKey][i]);
                max = Math.max(max, dataNameMap[mapKey][i]);
                sum += dataNameMap[mapKey][i];
            }
            var result;
            if (statisticType === 'min') {
                result = min;
            }
            else if (statisticType === 'max') {
                result = max;
            }
            else if (statisticType === 'average') {
                result = sum / len;
            }
            else {
                result = sum;
            }
            return len === 0 ? NaN : result;
        });
    }

    module.exports = function (ecModel) {
        var seriesGroups = {};
        ecModel.eachSeriesByType('map', function (seriesModel) {
            var hostGeoModel = seriesModel.getHostGeoModel();
            var key = hostGeoModel ? 'o' + hostGeoModel.id : 'i' + seriesModel.getMapType();
            (seriesGroups[key] = seriesGroups[key] || []).push(seriesModel);
        });

        zrUtil.each(seriesGroups, function (seriesList, key) {
            var data = dataStatistics(
                zrUtil.map(seriesList, function (seriesModel) {
                    return seriesModel.getData();
                }),
                seriesList[0].get('mapValueCalculation')
            );

            for (var i = 0; i < seriesList.length; i++) {
                seriesList[i].originalData = seriesList[i].getData();
            }

            // FIXME Put where?
            for (var i = 0; i < seriesList.length; i++) {
                seriesList[i].seriesGroup = seriesList;
                seriesList[i].needsDrawMap = i === 0 && !seriesList[i].getHostGeoModel();

                seriesList[i].setData(data.cloneShallow());
                seriesList[i].mainSeries = seriesList[0];
            }
        });
    };


/***/ }),

/***/ 809:
/***/ (function(module, exports, __webpack_require__) {



    var zrUtil = __webpack_require__(2);

    module.exports = function (ecModel) {

        var processedMapType = {};

        ecModel.eachSeriesByType('map', function (mapSeries) {
            var mapType = mapSeries.getMapType();
            if (mapSeries.getHostGeoModel() || processedMapType[mapType]) {
                return;
            }

            var mapSymbolOffsets = {};

            zrUtil.each(mapSeries.seriesGroup, function (subMapSeries) {
                var geo = subMapSeries.coordinateSystem;
                var data = subMapSeries.originalData;
                if (subMapSeries.get('showLegendSymbol') && ecModel.getComponent('legend')) {
                    data.each('value', function (value, idx) {
                        var name = data.getName(idx);
                        var region = geo.getRegion(name);

                        // If input series.data is [11, 22, '-'/null/undefined, 44],
                        // it will be filled with NaN: [11, 22, NaN, 44] and NaN will
                        // not be drawn. So here must validate if value is NaN.
                        if (!region || isNaN(value)) {
                            return;
                        }

                        var offset = mapSymbolOffsets[name] || 0;

                        var point = geo.dataToPoint(region.center);

                        mapSymbolOffsets[name] = offset + 1;

                        data.setItemLayout(idx, {
                            point: point,
                            offset: offset
                        });
                    });
                }
            });

            // Show label of those region not has legendSymbol(which is offset 0)
            var data = mapSeries.getData();
            data.each(function (idx) {
                var name = data.getName(idx);
                var layout = data.getItemLayout(idx) || {};
                layout.showLabel = !mapSymbolOffsets[name];
                data.setItemLayout(idx, layout);
            });

            processedMapType[mapType] = true;
        });
    };


/***/ }),

/***/ 810:
/***/ (function(module, exports) {


    module.exports = function (ecModel) {
        ecModel.eachSeriesByType('map', function (seriesModel) {
            var colorList = seriesModel.get('color');
            var itemStyleModel = seriesModel.getModel('itemStyle.normal');

            var areaColor = itemStyleModel.get('areaColor');
            var color = itemStyleModel.get('color')
                || colorList[seriesModel.seriesIndex % colorList.length];

            seriesModel.getData().setVisual({
                'areaColor': areaColor,
                'color': color
            });
        });
    };


/***/ }),

/***/ 828:
/***/ (function(module, exports, __webpack_require__) {

/**
 * @module echarts/component/helper/MapDraw
 */


    var RoamController = __webpack_require__(829);
    var roamHelper = __webpack_require__(831);
    var cursorHelper = __webpack_require__(357);
    var graphic = __webpack_require__(17);
    var zrUtil = __webpack_require__(2);

    function getFixedItemStyle(model, scale) {
        var itemStyle = model.getItemStyle();
        var areaColor = model.get('areaColor');

        // If user want the color not to be changed when hover,
        // they should both set areaColor and color to be null.
        if (areaColor != null) {
            itemStyle.fill = areaColor;
        }

        return itemStyle;
    }

    function updateMapSelectHandler(mapDraw, mapOrGeoModel, group, api, fromView) {
        group.off('click');
        group.off('mousedown');

        if (mapOrGeoModel.get('selectedMode')) {

            group.on('mousedown', function () {
                mapDraw._mouseDownFlag = true;
            });

            group.on('click', function (e) {
                if (!mapDraw._mouseDownFlag) {
                    return;
                }
                mapDraw._mouseDownFlag = false;

                var el = e.target;
                while (!el.__regions) {
                    el = el.parent;
                }
                if (!el) {
                    return;
                }

                var action = {
                    type: (mapOrGeoModel.mainType === 'geo' ? 'geo' : 'map') + 'ToggleSelect',
                    batch: zrUtil.map(el.__regions, function (region) {
                        return {
                            name: region.name,
                            from: fromView.uid
                        };
                    })
                };
                action[mapOrGeoModel.mainType + 'Id'] = mapOrGeoModel.id;

                api.dispatchAction(action);

                updateMapSelected(mapOrGeoModel, group);
            });
        }
    }

    function updateMapSelected(mapOrGeoModel, group) {
        // FIXME
        group.eachChild(function (otherRegionEl) {
            zrUtil.each(otherRegionEl.__regions, function (region) {
                otherRegionEl.trigger(mapOrGeoModel.isSelected(region.name) ? 'emphasis' : 'normal');
            });
        });
    }

    /**
     * @alias module:echarts/component/helper/MapDraw
     * @param {module:echarts/ExtensionAPI} api
     * @param {boolean} updateGroup
     */
    function MapDraw(api, updateGroup) {

        var group = new graphic.Group();

        /**
         * @type {module:echarts/component/helper/RoamController}
         * @private
         */
        this._controller = new RoamController(api.getZr());

        /**
         * @type {Object} {target, zoom, zoomLimit}
         * @private
         */
        this._controllerHost = {target: updateGroup ? group : null};

        /**
         * @type {module:zrender/container/Group}
         * @readOnly
         */
        this.group = group;

        /**
         * @type {boolean}
         * @private
         */
        this._updateGroup = updateGroup;

        /**
         * This flag is used to make sure that only one among
         * `pan`, `zoom`, `click` can occurs, otherwise 'selected'
         * action may be triggered when `pan`, which is unexpected.
         * @type {booelan}
         */
        this._mouseDownFlag;
    }

    MapDraw.prototype = {

        constructor: MapDraw,

        draw: function (mapOrGeoModel, ecModel, api, fromView, payload) {

            var isGeo = mapOrGeoModel.mainType === 'geo';

            // Map series has data. GEO model that controlled by map series
            // will be assigned with map data. Other GEO model has no data.
            var data = mapOrGeoModel.getData && mapOrGeoModel.getData();
            isGeo && ecModel.eachComponent({mainType: 'series', subType: 'map'}, function (mapSeries) {
                if (!data && mapSeries.getHostGeoModel() === mapOrGeoModel) {
                    data = mapSeries.getData();
                }
            });

            var geo = mapOrGeoModel.coordinateSystem;

            var group = this.group;

            var scale = geo.scale;
            var groupNewProp = {
                position: geo.position,
                scale: scale
            };

            // No animation when first draw or in action
            if (!group.childAt(0) || payload) {
                group.attr(groupNewProp);
            }
            else {
                graphic.updateProps(group, groupNewProp, mapOrGeoModel);
            }

            group.removeAll();

            var itemStyleAccessPath = ['itemStyle', 'normal'];
            var hoverItemStyleAccessPath = ['itemStyle', 'emphasis'];
            var labelAccessPath = ['label', 'normal'];
            var hoverLabelAccessPath = ['label', 'emphasis'];
            var nameMap = zrUtil.createHashMap();

            zrUtil.each(geo.regions, function (region) {

                // Consider in GeoJson properties.name may be duplicated, for example,
                // there is multiple region named "United Kindom" or "France" (so many
                // colonies). And it is not appropriate to merge them in geo, which
                // will make them share the same label and bring trouble in label
                // location calculation.
                var regionGroup = nameMap.get(region.name)
                    || nameMap.set(region.name, new graphic.Group());

                var compoundPath = new graphic.CompoundPath({
                    shape: {
                        paths: []
                    }
                });
                regionGroup.add(compoundPath);

                var regionModel = mapOrGeoModel.getRegionModel(region.name) || mapOrGeoModel;

                var itemStyleModel = regionModel.getModel(itemStyleAccessPath);
                var hoverItemStyleModel = regionModel.getModel(hoverItemStyleAccessPath);
                var itemStyle = getFixedItemStyle(itemStyleModel, scale);
                var hoverItemStyle = getFixedItemStyle(hoverItemStyleModel, scale);

                var labelModel = regionModel.getModel(labelAccessPath);
                var hoverLabelModel = regionModel.getModel(hoverLabelAccessPath);

                var dataIdx;
                // Use the itemStyle in data if has data
                if (data) {
                    dataIdx = data.indexOfName(region.name);
                    // Only visual color of each item will be used. It can be encoded by dataRange
                    // But visual color of series is used in symbol drawing
                    //
                    // Visual color for each series is for the symbol draw
                    var visualColor = data.getItemVisual(dataIdx, 'color', true);
                    if (visualColor) {
                        itemStyle.fill = visualColor;
                    }
                }

                zrUtil.each(region.geometries, function (geometry) {
                    if (geometry.type !== 'polygon') {
                        return;
                    }
                    compoundPath.shape.paths.push(new graphic.Polygon({
                        shape: {
                            points: geometry.exterior
                        }
                    }));

                    for (var i = 0; i < (geometry.interiors ? geometry.interiors.length : 0); i++) {
                        compoundPath.shape.paths.push(new graphic.Polygon({
                            shape: {
                                points: geometry.interiors[i]
                            }
                        }));
                    }
                });

                compoundPath.setStyle(itemStyle);
                compoundPath.style.strokeNoScale = true;
                compoundPath.culling = true;
                // Label
                var showLabel = labelModel.get('show');
                var hoverShowLabel = hoverLabelModel.get('show');

                var isDataNaN = data && isNaN(data.get('value', dataIdx));
                var itemLayout = data && data.getItemLayout(dataIdx);
                // In the following cases label will be drawn
                // 1. In map series and data value is NaN
                // 2. In geo component
                // 4. Region has no series legendSymbol, which will be add a showLabel flag in mapSymbolLayout
                if (
                    (isGeo || isDataNaN && (showLabel || hoverShowLabel))
                 || (itemLayout && itemLayout.showLabel)
                 ) {
                    var query = !isGeo ? dataIdx : region.name;
                    var labelFetcher;

                    // Consider dataIdx not found.
                    if (!data || dataIdx >= 0) {
                        labelFetcher = mapOrGeoModel;
                    }

                    var textEl = new graphic.Text({
                        position: region.center.slice(),
                        scale: [1 / scale[0], 1 / scale[1]],
                        z2: 10,
                        silent: true
                    });

                    graphic.setLabelStyle(
                        textEl.style, textEl.hoverStyle = {}, labelModel, hoverLabelModel,
                        {
                            labelFetcher: labelFetcher,
                            labelDataIndex: query,
                            defaultText: region.name,
                            useInsideStyle: false
                        },
                        {
                            textAlign: 'center',
                            textVerticalAlign: 'middle'
                        }
                    );

                    regionGroup.add(textEl);
                }

                // setItemGraphicEl, setHoverStyle after all polygons and labels
                // are added to the rigionGroup
                if (data) {
                    data.setItemGraphicEl(dataIdx, regionGroup);
                }
                else {
                    var regionModel = mapOrGeoModel.getRegionModel(region.name);
                    // Package custom mouse event for geo component
                    compoundPath.eventData = {
                        componentType: 'geo',
                        geoIndex: mapOrGeoModel.componentIndex,
                        name: region.name,
                        region: (regionModel && regionModel.option) || {}
                    };
                }

                var groupRegions = regionGroup.__regions || (regionGroup.__regions = []);
                groupRegions.push(region);

                graphic.setHoverStyle(
                    regionGroup,
                    hoverItemStyle,
                    {hoverSilentOnTouch: !!mapOrGeoModel.get('selectedMode')}
                );

                group.add(regionGroup);
            });

            this._updateController(mapOrGeoModel, ecModel, api);

            updateMapSelectHandler(this, mapOrGeoModel, group, api, fromView);

            updateMapSelected(mapOrGeoModel, group);
        },

        remove: function () {
            this.group.removeAll();
            this._controller.dispose();
            this._controllerHost = {};
        },

        _updateController: function (mapOrGeoModel, ecModel, api) {
            var geo = mapOrGeoModel.coordinateSystem;
            var controller = this._controller;
            var controllerHost = this._controllerHost;

            controllerHost.zoomLimit = mapOrGeoModel.get('scaleLimit');
            controllerHost.zoom = geo.getZoom();

            // roamType is will be set default true if it is null
            controller.enable(mapOrGeoModel.get('roam') || false);
            var mainType = mapOrGeoModel.mainType;

            function makeActionBase() {
                var action = {
                    type: 'geoRoam',
                    componentType: mainType
                };
                action[mainType + 'Id'] = mapOrGeoModel.id;
                return action;
            }

            controller.off('pan').on('pan', function (dx, dy) {
                this._mouseDownFlag = false;

                roamHelper.updateViewOnPan(controllerHost, dx, dy);

                api.dispatchAction(zrUtil.extend(makeActionBase(), {
                    dx: dx,
                    dy: dy
                }));
            }, this);

            controller.off('zoom').on('zoom', function (zoom, mouseX, mouseY) {
                this._mouseDownFlag = false;

                roamHelper.updateViewOnZoom(controllerHost, zoom, mouseX, mouseY);

                api.dispatchAction(zrUtil.extend(makeActionBase(), {
                    zoom: zoom,
                    originX: mouseX,
                    originY: mouseY
                }));

                if (this._updateGroup) {
                    var group = this.group;
                    var scale = group.scale;
                    group.traverse(function (el) {
                        if (el.type === 'text') {
                            el.attr('scale', [1 / scale[0], 1 / scale[1]]);
                        }
                    });
                }
            }, this);

            controller.setPointerChecker(function (e, x, y) {
                return geo.getViewRectAfterRoam().contain(x, y)
                    && !cursorHelper.onIrrelevantElement(e, api, mapOrGeoModel);
            });
        }
    };

    module.exports = MapDraw;


/***/ }),

/***/ 829:
/***/ (function(module, exports, __webpack_require__) {

/**
 * @module echarts/component/helper/RoamController
 */


    var Eventful = __webpack_require__(125);
    var zrUtil = __webpack_require__(2);
    var eventTool = __webpack_require__(107);
    var interactionMutex = __webpack_require__(358);

    /**
     * @alias module:echarts/component/helper/RoamController
     * @constructor
     * @mixin {module:zrender/mixin/Eventful}
     *
     * @param {module:zrender/zrender~ZRender} zr
     */
    function RoamController(zr) {

        /**
         * @type {Function}
         */
        this.pointerChecker;

        /**
         * @type {module:zrender}
         */
        this._zr = zr;

        /**
         * @type {Object}
         */
        this._opt = {};

        // Avoid two roamController bind the same handler
        var bind = zrUtil.bind;
        var mousedownHandler = bind(mousedown, this);
        var mousemoveHandler = bind(mousemove, this);
        var mouseupHandler = bind(mouseup, this);
        var mousewheelHandler = bind(mousewheel, this);
        var pinchHandler = bind(pinch, this);

        Eventful.call(this);

        /**
         * @param {Function} pointerChecker
         *                   input: x, y
         *                   output: boolean
         */
        this.setPointerChecker = function (pointerChecker) {
            this.pointerChecker = pointerChecker;
        };

        /**
         * Notice: only enable needed types. For example, if 'zoom'
         * is not needed, 'zoom' should not be enabled, otherwise
         * default mousewheel behaviour (scroll page) will be disabled.
         *
         * @param  {boolean|string} [controlType=true] Specify the control type,
         *                          which can be null/undefined or true/false
         *                          or 'pan/move' or 'zoom'/'scale'
         * @param {Object} [opt]
         * @param {Object} [opt.zoomOnMouseWheel=true]
         * @param {Object} [opt.moveOnMouseMove=true]
         * @param {Object} [opt.preventDefaultMouseMove=true] When pan.
         */
        this.enable = function (controlType, opt) {

            // Disable previous first
            this.disable();

            this._opt = zrUtil.defaults(zrUtil.clone(opt) || {}, {
                zoomOnMouseWheel: true,
                moveOnMouseMove: true,
                preventDefaultMouseMove: true
            });

            if (controlType == null) {
                controlType = true;
            }

            if (controlType === true || (controlType === 'move' || controlType === 'pan')) {
                zr.on('mousedown', mousedownHandler);
                zr.on('mousemove', mousemoveHandler);
                zr.on('mouseup', mouseupHandler);
            }
            if (controlType === true || (controlType === 'scale' || controlType === 'zoom')) {
                zr.on('mousewheel', mousewheelHandler);
                zr.on('pinch', pinchHandler);
            }
        };

        this.disable = function () {
            zr.off('mousedown', mousedownHandler);
            zr.off('mousemove', mousemoveHandler);
            zr.off('mouseup', mouseupHandler);
            zr.off('mousewheel', mousewheelHandler);
            zr.off('pinch', pinchHandler);
        };

        this.dispose = this.disable;

        this.isDragging = function () {
            return this._dragging;
        };

        this.isPinching = function () {
            return this._pinching;
        };
    }

    zrUtil.mixin(RoamController, Eventful);


    function mousedown(e) {
        if (eventTool.notLeftMouse(e)
            || (e.target && e.target.draggable)
        ) {
            return;
        }

        var x = e.offsetX;
        var y = e.offsetY;

        // Only check on mosedown, but not mousemove.
        // Mouse can be out of target when mouse moving.
        if (this.pointerChecker && this.pointerChecker(e, x, y)) {
            this._x = x;
            this._y = y;
            this._dragging = true;
        }
    }

    function mousemove(e) {
        if (eventTool.notLeftMouse(e)
            || !checkKeyBinding(this, 'moveOnMouseMove', e)
            || !this._dragging
            || e.gestureEvent === 'pinch'
            || interactionMutex.isTaken(this._zr, 'globalPan')
        ) {
            return;
        }

        var x = e.offsetX;
        var y = e.offsetY;

        var oldX = this._x;
        var oldY = this._y;

        var dx = x - oldX;
        var dy = y - oldY;

        this._x = x;
        this._y = y;

        this._opt.preventDefaultMouseMove && eventTool.stop(e.event);

        this.trigger('pan', dx, dy, oldX, oldY, x, y);
    }

    function mouseup(e) {
        if (!eventTool.notLeftMouse(e)) {
            this._dragging = false;
        }
    }

    function mousewheel(e) {
        // wheelDelta maybe -0 in chrome mac.
        if (!checkKeyBinding(this, 'zoomOnMouseWheel', e) || e.wheelDelta === 0) {
            return;
        }

        // Convenience:
        // Mac and VM Windows on Mac: scroll up: zoom out.
        // Windows: scroll up: zoom in.
        var zoomDelta = e.wheelDelta > 0 ? 1.1 : 1 / 1.1;
        zoom.call(this, e, zoomDelta, e.offsetX, e.offsetY);
    }

    function pinch(e) {
        if (interactionMutex.isTaken(this._zr, 'globalPan')) {
            return;
        }
        var zoomDelta = e.pinchScale > 1 ? 1.1 : 1 / 1.1;
        zoom.call(this, e, zoomDelta, e.pinchX, e.pinchY);
    }

    function zoom(e, zoomDelta, zoomX, zoomY) {
        if (this.pointerChecker && this.pointerChecker(e, zoomX, zoomY)) {
            // When mouse is out of roamController rect,
            // default befavoius should not be be disabled, otherwise
            // page sliding is disabled, contrary to expectation.
            eventTool.stop(e.event);

            this.trigger('zoom', zoomDelta, zoomX, zoomY);
        }
    }

    function checkKeyBinding(roamController, prop, e) {
        var setting = roamController._opt[prop];
        return setting
            && (!zrUtil.isString(setting) || e.event[setting + 'Key']);
    }

    module.exports = RoamController;


/***/ }),

/***/ 831:
/***/ (function(module, exports) {



    var helper = {};

    /**
     * For geo and graph.
     *
     * @param {Object} controllerHost
     * @param {module:zrender/Element} controllerHost.target
     */
    helper.updateViewOnPan = function (controllerHost, dx, dy) {
        var target = controllerHost.target;
        var pos = target.position;
        pos[0] += dx;
        pos[1] += dy;
        target.dirty();
    };

    /**
     * For geo and graph.
     *
     * @param {Object} controllerHost
     * @param {module:zrender/Element} controllerHost.target
     * @param {number} controllerHost.zoom
     * @param {number} controllerHost.zoomLimit like: {min: 1, max: 2}
     */
    helper.updateViewOnZoom = function (controllerHost, zoomDelta, zoomX, zoomY) {
        var target = controllerHost.target;
        var zoomLimit = controllerHost.zoomLimit;
        var pos = target.position;
        var scale = target.scale;

        var newZoom = controllerHost.zoom = controllerHost.zoom || 1;
        newZoom *= zoomDelta;
        if (zoomLimit) {
            var zoomMin = zoomLimit.min || 0;
            var zoomMax = zoomLimit.max || Infinity;
            newZoom = Math.max(
                Math.min(zoomMax, newZoom),
                zoomMin
            );
        }
        var zoomScale = newZoom / controllerHost.zoom;
        controllerHost.zoom = newZoom;
        // Keep the mouse center when scaling
        pos[0] -= (zoomX - pos[0]) * (zoomScale - 1);
        pos[1] -= (zoomY - pos[1]) * (zoomScale - 1);
        scale[0] *= zoomScale;
        scale[1] *= zoomScale;

        target.dirty();
    };

    module.exports = helper;


/***/ }),

/***/ 846:
/***/ (function(module, exports, __webpack_require__) {

/**
 * visualMap component entry
 */


    __webpack_require__(847);
    __webpack_require__(848);



/***/ }),

/***/ 847:
/***/ (function(module, exports, __webpack_require__) {

/**
 * DataZoom component entry
 */


    __webpack_require__(10).registerPreprocessor(
        __webpack_require__(364)
    );

    __webpack_require__(365);
    __webpack_require__(366);
    __webpack_require__(849);
    __webpack_require__(850);
    __webpack_require__(367);



/***/ }),

/***/ 848:
/***/ (function(module, exports, __webpack_require__) {

/**
 * DataZoom component entry
 */


    __webpack_require__(10).registerPreprocessor(
        __webpack_require__(364)
    );

    __webpack_require__(365);
    __webpack_require__(366);
    __webpack_require__(851);
    __webpack_require__(852);
    __webpack_require__(367);



/***/ }),

/***/ 849:
/***/ (function(module, exports, __webpack_require__) {

/**
 * @file Data zoom model
 */


    var VisualMapModel = __webpack_require__(361);
    var zrUtil = __webpack_require__(2);
    var numberUtil = __webpack_require__(24);

    // Constant
    var DEFAULT_BAR_BOUND = [20, 140];

    var ContinuousModel = VisualMapModel.extend({

        type: 'visualMap.continuous',

        /**
         * @protected
         */
        defaultOption: {
            align: 'auto',          // 'auto', 'left', 'right', 'top', 'bottom'
            calculable: false,      // This prop effect default component type determine,
                                    // See echarts/component/visualMap/typeDefaulter.
            range: null,            // selected range. In default case `range` is [min, max]
                                    // and can auto change along with modification of min max,
                                    // util use specifid a range.
            realtime: true,         // Whether realtime update.
            itemHeight: null,       // The length of the range control edge.
            itemWidth: null,        // The length of the other side.
            hoverLink: true,        // Enable hover highlight.
            hoverLinkDataSize: null,// The size of hovered data.
            hoverLinkOnHandle: null // Whether trigger hoverLink when hover handle.
                                    // If not specified, follow the value of `realtime`.
        },

        /**
         * @override
         */
        optionUpdated: function (newOption, isInit) {
            ContinuousModel.superApply(this, 'optionUpdated', arguments);

            this.resetExtent();

            this.resetVisual(function (mappingOption) {
                mappingOption.mappingMethod = 'linear';
                mappingOption.dataExtent = this.getExtent();
            });

            this._resetRange();
        },

        /**
         * @protected
         * @override
         */
        resetItemSize: function () {
            ContinuousModel.superApply(this, 'resetItemSize', arguments);

            var itemSize = this.itemSize;

            this._orient === 'horizontal' && itemSize.reverse();

            (itemSize[0] == null || isNaN(itemSize[0])) && (itemSize[0] = DEFAULT_BAR_BOUND[0]);
            (itemSize[1] == null || isNaN(itemSize[1])) && (itemSize[1] = DEFAULT_BAR_BOUND[1]);
        },

        /**
         * @private
         */
        _resetRange: function () {
            var dataExtent = this.getExtent();
            var range = this.option.range;

            if (!range || range.auto) {
                // `range` should always be array (so we dont use other
                // value like 'auto') for user-friend. (consider getOption).
                dataExtent.auto = 1;
                this.option.range = dataExtent;
            }
            else if (zrUtil.isArray(range)) {
                if (range[0] > range[1]) {
                    range.reverse();
                }
                range[0] = Math.max(range[0], dataExtent[0]);
                range[1] = Math.min(range[1], dataExtent[1]);
            }
        },

        /**
         * @protected
         * @override
         */
        completeVisualOption: function () {
            VisualMapModel.prototype.completeVisualOption.apply(this, arguments);

            zrUtil.each(this.stateList, function (state) {
                var symbolSize = this.option.controller[state].symbolSize;
                if (symbolSize && symbolSize[0] !== symbolSize[1]) {
                    symbolSize[0] = 0; // For good looking.
                }
            }, this);
        },

        /**
         * @override
         */
        setSelected: function (selected) {
            this.option.range = selected.slice();
            this._resetRange();
        },

        /**
         * @public
         */
        getSelected: function () {
            var dataExtent = this.getExtent();

            var dataInterval = numberUtil.asc(
                (this.get('range') || []).slice()
            );

            // Clamp
            dataInterval[0] > dataExtent[1] && (dataInterval[0] = dataExtent[1]);
            dataInterval[1] > dataExtent[1] && (dataInterval[1] = dataExtent[1]);
            dataInterval[0] < dataExtent[0] && (dataInterval[0] = dataExtent[0]);
            dataInterval[1] < dataExtent[0] && (dataInterval[1] = dataExtent[0]);

            return dataInterval;
        },

        /**
         * @override
         */
        getValueState: function (value) {
            var range = this.option.range;
            var dataExtent = this.getExtent();

            // When range[0] === dataExtent[0], any value larger than dataExtent[0] maps to 'inRange'.
            // range[1] is processed likewise.
            return (
                (range[0] <= dataExtent[0] || range[0] <= value)
                && (range[1] >= dataExtent[1] || value <= range[1])
            ) ? 'inRange' : 'outOfRange';
        },

        /**
         * @params {Array.<number>} range target value: range[0] <= value && value <= range[1]
         * @return {Array.<Object>} [{seriesId, dataIndices: <Array.<number>>}, ...]
         */
        findTargetDataIndices: function (range) {
            var result = [];

            this.eachTargetSeries(function (seriesModel) {
                var dataIndices = [];
                var data = seriesModel.getData();

                data.each(this.getDataDimension(data), function (value, dataIndex) {
                    range[0] <= value && value <= range[1] && dataIndices.push(dataIndex);
                }, true, this);

                result.push({seriesId: seriesModel.id, dataIndex: dataIndices});
            }, this);

            return result;
        },

        /**
         * @implement
         */
        getVisualMeta: function (getColorVisual) {
            var oVals = getColorStopValues(this, 'outOfRange', this.getExtent());
            var iVals = getColorStopValues(this, 'inRange', this.option.range.slice());
            var stops = [];

            function setStop(value, valueState) {
                stops.push({
                    value: value,
                    color: getColorVisual(value, valueState)
                });
            }

            // Format to: outOfRange -- inRange -- outOfRange.
            var iIdx = 0;
            var oIdx = 0;
            var iLen = iVals.length;
            var oLen = oVals.length;

            for (; oIdx < oLen && (!iVals.length || oVals[oIdx] <= iVals[0]); oIdx++) {
                // If oVal[oIdx] === iVals[iIdx], oVal[oIdx] should be ignored.
                if (oVals[oIdx] < iVals[iIdx]) {
                    setStop(oVals[oIdx], 'outOfRange');
                }
            }
            for (var first = 1; iIdx < iLen; iIdx++, first = 0) {
                // If range is full, value beyond min, max will be clamped.
                // make a singularity
                first && stops.length && setStop(iVals[iIdx], 'outOfRange');
                setStop(iVals[iIdx], 'inRange');
            }
            for (var first = 1; oIdx < oLen; oIdx++) {
                if (!iVals.length || iVals[iVals.length - 1] < oVals[oIdx]) {
                    // make a singularity
                    if (first) {
                        stops.length && setStop(stops[stops.length - 1].value, 'outOfRange');
                        first = 0;
                    }
                    setStop(oVals[oIdx], 'outOfRange');
                }
            }

            var stopsLen = stops.length;

            return {
                stops: stops,
                outerColors: [
                    stopsLen ? stops[0].color : 'transparent',
                    stopsLen ? stops[stopsLen - 1].color : 'transparent'
                ]
            };
        }

    });

    function getColorStopValues(visualMapModel, valueState, dataExtent) {
        if (dataExtent[0] === dataExtent[1]) {
            return dataExtent.slice();
        }

        // When using colorHue mapping, it is not linear color any more.
        // Moreover, canvas gradient seems not to be accurate linear.
        // FIXME
        // Should be arbitrary value 100? or based on pixel size?
        var count = 200;
        var step = (dataExtent[1] - dataExtent[0]) / count;

        var value = dataExtent[0];
        var stopValues = [];
        for (var i = 0; i <= count && value < dataExtent[1]; i++) {
            stopValues.push(value);
            value += step;
        }
        stopValues.push(dataExtent[1]);

        return stopValues;
    }

    module.exports = ContinuousModel;



/***/ }),

/***/ 850:
/***/ (function(module, exports, __webpack_require__) {



    var VisualMapView = __webpack_require__(362);
    var graphic = __webpack_require__(17);
    var zrUtil = __webpack_require__(2);
    var numberUtil = __webpack_require__(24);
    var sliderMove = __webpack_require__(360);
    var LinearGradient = __webpack_require__(514);
    var helper = __webpack_require__(363);
    var modelUtil = __webpack_require__(29);
    var eventTool = __webpack_require__(107);

    var linearMap = numberUtil.linearMap;
    var each = zrUtil.each;
    var mathMin = Math.min;
    var mathMax = Math.max;

    // Arbitrary value
    var HOVER_LINK_SIZE = 12;
    var HOVER_LINK_OUT = 6;

    // Notice:
    // Any "interval" should be by the order of [low, high].
    // "handle0" (handleIndex === 0) maps to
    // low data value: this._dataInterval[0] and has low coord.
    // "handle1" (handleIndex === 1) maps to
    // high data value: this._dataInterval[1] and has high coord.
    // The logic of transform is implemented in this._createBarGroup.

    var ContinuousView = VisualMapView.extend({

        type: 'visualMap.continuous',

        /**
         * @override
         */
        init: function () {

            ContinuousView.superApply(this, 'init', arguments);

            /**
             * @private
             */
            this._shapes = {};

            /**
             * @private
             */
            this._dataInterval = [];

            /**
             * @private
             */
            this._handleEnds = [];

            /**
             * @private
             */
            this._orient;

            /**
             * @private
             */
            this._useHandle;

            /**
             * @private
             */
            this._hoverLinkDataIndices = [];

            /**
             * @private
             */
            this._dragging;

            /**
             * @private
             */
            this._hovering;
        },

        /**
         * @protected
         * @override
         */
        doRender: function (visualMapModel, ecModel, api, payload) {
            if (!payload || payload.type !== 'selectDataRange' || payload.from !== this.uid) {
                this._buildView();
            }
        },

        /**
         * @private
         */
        _buildView: function () {
            this.group.removeAll();

            var visualMapModel = this.visualMapModel;
            var thisGroup = this.group;

            this._orient = visualMapModel.get('orient');
            this._useHandle = visualMapModel.get('calculable');

            this._resetInterval();

            this._renderBar(thisGroup);

            var dataRangeText = visualMapModel.get('text');
            this._renderEndsText(thisGroup, dataRangeText, 0);
            this._renderEndsText(thisGroup, dataRangeText, 1);

            // Do this for background size calculation.
            this._updateView(true);

            // After updating view, inner shapes is built completely,
            // and then background can be rendered.
            this.renderBackground(thisGroup);

            // Real update view
            this._updateView();

            this._enableHoverLinkToSeries();
            this._enableHoverLinkFromSeries();

            this.positionGroup(thisGroup);
        },

        /**
         * @private
         */
        _renderEndsText: function (group, dataRangeText, endsIndex) {
            if (!dataRangeText) {
                return;
            }

            // Compatible with ec2, text[0] map to high value, text[1] map low value.
            var text = dataRangeText[1 - endsIndex];
            text = text != null ? text + '' : '';

            var visualMapModel = this.visualMapModel;
            var textGap = visualMapModel.get('textGap');
            var itemSize = visualMapModel.itemSize;

            var barGroup = this._shapes.barGroup;
            var position = this._applyTransform(
                [
                    itemSize[0] / 2,
                    endsIndex === 0 ? -textGap : itemSize[1] + textGap
                ],
                barGroup
            );
            var align = this._applyTransform(
                endsIndex === 0 ? 'bottom' : 'top',
                barGroup
            );
            var orient = this._orient;
            var textStyleModel = this.visualMapModel.textStyleModel;

            this.group.add(new graphic.Text({
                style: {
                    x: position[0],
                    y: position[1],
                    textVerticalAlign: orient === 'horizontal' ? 'middle' : align,
                    textAlign: orient === 'horizontal' ? align : 'center',
                    text: text,
                    textFont: textStyleModel.getFont(),
                    textFill: textStyleModel.getTextColor()
                }
            }));
        },

        /**
         * @private
         */
        _renderBar: function (targetGroup) {
            var visualMapModel = this.visualMapModel;
            var shapes = this._shapes;
            var itemSize = visualMapModel.itemSize;
            var orient = this._orient;
            var useHandle = this._useHandle;
            var itemAlign = helper.getItemAlign(visualMapModel, this.api, itemSize);
            var barGroup = shapes.barGroup = this._createBarGroup(itemAlign);

            // Bar
            barGroup.add(shapes.outOfRange = createPolygon());
            barGroup.add(shapes.inRange = createPolygon(
                null,
                useHandle ? getCursor(this._orient) : null,
                zrUtil.bind(this._dragHandle, this, 'all', false),
                zrUtil.bind(this._dragHandle, this, 'all', true)
            ));

            var textRect = visualMapModel.textStyleModel.getTextRect('国');
            var textSize = mathMax(textRect.width, textRect.height);

            // Handle
            if (useHandle) {
                shapes.handleThumbs = [];
                shapes.handleLabels = [];
                shapes.handleLabelPoints = [];

                this._createHandle(barGroup, 0, itemSize, textSize, orient, itemAlign);
                this._createHandle(barGroup, 1, itemSize, textSize, orient, itemAlign);
            }

            this._createIndicator(barGroup, itemSize, textSize, orient);

            targetGroup.add(barGroup);
        },

        /**
         * @private
         */
        _createHandle: function (barGroup, handleIndex, itemSize, textSize, orient) {
            var onDrift = zrUtil.bind(this._dragHandle, this, handleIndex, false);
            var onDragEnd = zrUtil.bind(this._dragHandle, this, handleIndex, true);
            var handleThumb = createPolygon(
                createHandlePoints(handleIndex, textSize),
                getCursor(this._orient),
                onDrift,
                onDragEnd
            );
            handleThumb.position[0] = itemSize[0];
            barGroup.add(handleThumb);

            // Text is always horizontal layout but should not be effected by
            // transform (orient/inverse). So label is built separately but not
            // use zrender/graphic/helper/RectText, and is located based on view
            // group (according to handleLabelPoint) but not barGroup.
            var textStyleModel = this.visualMapModel.textStyleModel;
            var handleLabel = new graphic.Text({
                draggable: true,
                drift: onDrift,
                onmousemove: function (e) {
                    // Fot mobile devicem, prevent screen slider on the button.
                    eventTool.stop(e.event);
                },
                ondragend: onDragEnd,
                style: {
                    x: 0, y: 0, text: '',
                    textFont: textStyleModel.getFont(),
                    textFill: textStyleModel.getTextColor()
                }
            });
            this.group.add(handleLabel);

            var handleLabelPoint = [
                orient === 'horizontal'
                    ? textSize / 2
                    : textSize * 1.5,
                orient === 'horizontal'
                    ? (handleIndex === 0 ? -(textSize * 1.5) : (textSize * 1.5))
                    : (handleIndex === 0 ? -textSize / 2 : textSize / 2)
            ];

            var shapes = this._shapes;
            shapes.handleThumbs[handleIndex] = handleThumb;
            shapes.handleLabelPoints[handleIndex] = handleLabelPoint;
            shapes.handleLabels[handleIndex] = handleLabel;
        },

        /**
         * @private
         */
        _createIndicator: function (barGroup, itemSize, textSize, orient) {
            var indicator = createPolygon([[0, 0]], 'move');
            indicator.position[0] = itemSize[0];
            indicator.attr({invisible: true, silent: true});
            barGroup.add(indicator);

            var textStyleModel = this.visualMapModel.textStyleModel;
            var indicatorLabel = new graphic.Text({
                silent: true,
                invisible: true,
                style: {
                    x: 0, y: 0, text: '',
                    textFont: textStyleModel.getFont(),
                    textFill: textStyleModel.getTextColor()
                }
            });
            this.group.add(indicatorLabel);

            var indicatorLabelPoint = [
                orient === 'horizontal' ? textSize / 2 : HOVER_LINK_OUT + 3,
                0
            ];

            var shapes = this._shapes;
            shapes.indicator = indicator;
            shapes.indicatorLabel = indicatorLabel;
            shapes.indicatorLabelPoint = indicatorLabelPoint;
        },

        /**
         * @private
         */
        _dragHandle: function (handleIndex, isEnd, dx, dy) {
            if (!this._useHandle) {
                return;
            }

            this._dragging = !isEnd;

            if (!isEnd) {
                // Transform dx, dy to bar coordination.
                var vertex = this._applyTransform([dx, dy], this._shapes.barGroup, true);
                this._updateInterval(handleIndex, vertex[1]);

                // Considering realtime, update view should be executed
                // before dispatch action.
                this._updateView();
            }

            // dragEnd do not dispatch action when realtime.
            if (isEnd === !this.visualMapModel.get('realtime')) { // jshint ignore:line
                this.api.dispatchAction({
                    type: 'selectDataRange',
                    from: this.uid,
                    visualMapId: this.visualMapModel.id,
                    selected: this._dataInterval.slice()
                });
            }

            if (isEnd) {
                !this._hovering && this._clearHoverLinkToSeries();
            }
            else if (useHoverLinkOnHandle(this.visualMapModel)) {
                this._doHoverLinkToSeries(this._handleEnds[handleIndex], false);
            }
        },

        /**
         * @private
         */
        _resetInterval: function () {
            var visualMapModel = this.visualMapModel;

            var dataInterval = this._dataInterval = visualMapModel.getSelected();
            var dataExtent = visualMapModel.getExtent();
            var sizeExtent = [0, visualMapModel.itemSize[1]];

            this._handleEnds = [
                linearMap(dataInterval[0], dataExtent, sizeExtent, true),
                linearMap(dataInterval[1], dataExtent, sizeExtent, true)
            ];
        },

        /**
         * @private
         * @param {(number|string)} handleIndex 0 or 1 or 'all'
         * @param {number} dx
         * @param {number} dy
         */
        _updateInterval: function (handleIndex, delta) {
            delta = delta || 0;
            var visualMapModel = this.visualMapModel;
            var handleEnds = this._handleEnds;
            var sizeExtent = [0, visualMapModel.itemSize[1]];

            sliderMove(
                delta,
                handleEnds,
                sizeExtent,
                handleIndex,
                // cross is forbiden
                0
            );

            var dataExtent = visualMapModel.getExtent();
            // Update data interval.
            this._dataInterval = [
                linearMap(handleEnds[0], sizeExtent, dataExtent, true),
                linearMap(handleEnds[1], sizeExtent, dataExtent, true)
            ];
        },

        /**
         * @private
         */
        _updateView: function (forSketch) {
            var visualMapModel = this.visualMapModel;
            var dataExtent = visualMapModel.getExtent();
            var shapes = this._shapes;

            var outOfRangeHandleEnds = [0, visualMapModel.itemSize[1]];
            var inRangeHandleEnds = forSketch ? outOfRangeHandleEnds : this._handleEnds;

            var visualInRange = this._createBarVisual(
                this._dataInterval, dataExtent, inRangeHandleEnds, 'inRange'
            );
            var visualOutOfRange = this._createBarVisual(
                dataExtent, dataExtent, outOfRangeHandleEnds, 'outOfRange'
            );

            shapes.inRange
                .setStyle({
                    fill: visualInRange.barColor,
                    opacity: visualInRange.opacity
                })
                .setShape('points', visualInRange.barPoints);
            shapes.outOfRange
                .setStyle({
                    fill: visualOutOfRange.barColor,
                    opacity: visualOutOfRange.opacity
                })
                .setShape('points', visualOutOfRange.barPoints);

            this._updateHandle(inRangeHandleEnds, visualInRange);
        },

        /**
         * @private
         */
        _createBarVisual: function (dataInterval, dataExtent, handleEnds, forceState) {
            var opts = {
                forceState: forceState,
                convertOpacityToAlpha: true
            };
            var colorStops = this._makeColorGradient(dataInterval, opts);

            var symbolSizes = [
                this.getControllerVisual(dataInterval[0], 'symbolSize', opts),
                this.getControllerVisual(dataInterval[1], 'symbolSize', opts)
            ];
            var barPoints = this._createBarPoints(handleEnds, symbolSizes);

            return {
                barColor: new LinearGradient(0, 0, 0, 1, colorStops),
                barPoints: barPoints,
                handlesColor: [
                    colorStops[0].color,
                    colorStops[colorStops.length - 1].color
                ]
            };
        },

        /**
         * @private
         */
        _makeColorGradient: function (dataInterval, opts) {
            // Considering colorHue, which is not linear, so we have to sample
            // to calculate gradient color stops, but not only caculate head
            // and tail.
            var sampleNumber = 100; // Arbitrary value.
            var colorStops = [];
            var step = (dataInterval[1] - dataInterval[0]) / sampleNumber;

            colorStops.push({
                color: this.getControllerVisual(dataInterval[0], 'color', opts),
                offset: 0
            });

            for (var i = 1; i < sampleNumber; i++) {
                var currValue = dataInterval[0] + step * i;
                if (currValue > dataInterval[1]) {
                    break;
                }
                colorStops.push({
                    color: this.getControllerVisual(currValue, 'color', opts),
                    offset: i / sampleNumber
                });
            }

            colorStops.push({
                color: this.getControllerVisual(dataInterval[1], 'color', opts),
                offset: 1
            });

            return colorStops;
        },

        /**
         * @private
         */
        _createBarPoints: function (handleEnds, symbolSizes) {
            var itemSize = this.visualMapModel.itemSize;

            return [
                [itemSize[0] - symbolSizes[0], handleEnds[0]],
                [itemSize[0], handleEnds[0]],
                [itemSize[0], handleEnds[1]],
                [itemSize[0] - symbolSizes[1], handleEnds[1]]
            ];
        },

        /**
         * @private
         */
        _createBarGroup: function (itemAlign) {
            var orient = this._orient;
            var inverse = this.visualMapModel.get('inverse');

            return new graphic.Group(
                (orient === 'horizontal' && !inverse)
                ? {scale: itemAlign === 'bottom' ? [1, 1] : [-1, 1], rotation: Math.PI / 2}
                : (orient === 'horizontal' && inverse)
                ? {scale: itemAlign === 'bottom' ? [-1, 1] : [1, 1], rotation: -Math.PI / 2}
                : (orient === 'vertical' && !inverse)
                ? {scale: itemAlign === 'left' ? [1, -1] : [-1, -1]}
                : {scale: itemAlign === 'left' ? [1, 1] : [-1, 1]}
            );
        },

        /**
         * @private
         */
        _updateHandle: function (handleEnds, visualInRange) {
            if (!this._useHandle) {
                return;
            }

            var shapes = this._shapes;
            var visualMapModel = this.visualMapModel;
            var handleThumbs = shapes.handleThumbs;
            var handleLabels = shapes.handleLabels;

            each([0, 1], function (handleIndex) {
                var handleThumb = handleThumbs[handleIndex];
                handleThumb.setStyle('fill', visualInRange.handlesColor[handleIndex]);
                handleThumb.position[1] = handleEnds[handleIndex];

                // Update handle label position.
                var textPoint = graphic.applyTransform(
                    shapes.handleLabelPoints[handleIndex],
                    graphic.getTransform(handleThumb, this.group)
                );
                handleLabels[handleIndex].setStyle({
                    x: textPoint[0],
                    y: textPoint[1],
                    text: visualMapModel.formatValueText(this._dataInterval[handleIndex]),
                    textVerticalAlign: 'middle',
                    textAlign: this._applyTransform(
                        this._orient === 'horizontal'
                            ? (handleIndex === 0 ? 'bottom' : 'top')
                            : 'left',
                        shapes.barGroup
                    )
                });
            }, this);
        },

        /**
         * @private
         * @param {number} cursorValue
         * @param {number} textValue
         * @param {string} [rangeSymbol]
         * @param {number} [halfHoverLinkSize]
         */
        _showIndicator: function (cursorValue, textValue, rangeSymbol, halfHoverLinkSize) {
            var visualMapModel = this.visualMapModel;
            var dataExtent = visualMapModel.getExtent();
            var itemSize = visualMapModel.itemSize;
            var sizeExtent = [0, itemSize[1]];
            var pos = linearMap(cursorValue, dataExtent, sizeExtent, true);

            var shapes = this._shapes;
            var indicator = shapes.indicator;
            if (!indicator) {
                return;
            }

            indicator.position[1] = pos;
            indicator.attr('invisible', false);
            indicator.setShape('points', createIndicatorPoints(
                !!rangeSymbol, halfHoverLinkSize, pos, itemSize[1]
            ));

            var opts = {convertOpacityToAlpha: true};
            var color = this.getControllerVisual(cursorValue, 'color', opts);
            indicator.setStyle('fill', color);

            // Update handle label position.
            var textPoint = graphic.applyTransform(
                shapes.indicatorLabelPoint,
                graphic.getTransform(indicator, this.group)
            );

            var indicatorLabel = shapes.indicatorLabel;
            indicatorLabel.attr('invisible', false);
            var align = this._applyTransform('left', shapes.barGroup);
            var orient = this._orient;
            indicatorLabel.setStyle({
                text: (rangeSymbol ? rangeSymbol : '') + visualMapModel.formatValueText(textValue),
                textVerticalAlign: orient === 'horizontal' ? align : 'middle',
                textAlign: orient === 'horizontal' ? 'center' : align,
                x: textPoint[0],
                y: textPoint[1]
            });
        },

        /**
         * @private
         */
        _enableHoverLinkToSeries: function () {
            var self = this;
            this._shapes.barGroup

                .on('mousemove', function (e) {
                    self._hovering = true;

                    if (!self._dragging) {
                        var itemSize = self.visualMapModel.itemSize;
                        var pos = self._applyTransform(
                            [e.offsetX, e.offsetY], self._shapes.barGroup, true, true
                        );
                        // For hover link show when hover handle, which might be
                        // below or upper than sizeExtent.
                        pos[1] = mathMin(mathMax(0, pos[1]), itemSize[1]);
                        self._doHoverLinkToSeries(
                            pos[1],
                            0 <= pos[0] && pos[0] <= itemSize[0]
                        );
                    }
                })

                .on('mouseout', function () {
                    // When mouse is out of handle, hoverLink still need
                    // to be displayed when realtime is set as false.
                    self._hovering = false;
                    !self._dragging && self._clearHoverLinkToSeries();
                });
        },

        /**
         * @private
         */
        _enableHoverLinkFromSeries: function () {
            var zr = this.api.getZr();

            if (this.visualMapModel.option.hoverLink) {
                zr.on('mouseover', this._hoverLinkFromSeriesMouseOver, this);
                zr.on('mouseout', this._hideIndicator, this);
            }
            else {
                this._clearHoverLinkFromSeries();
            }
        },

        /**
         * @private
         */
        _doHoverLinkToSeries: function (cursorPos, hoverOnBar) {
            var visualMapModel = this.visualMapModel;
            var itemSize = visualMapModel.itemSize;

            if (!visualMapModel.option.hoverLink) {
                return;
            }

            var sizeExtent = [0, itemSize[1]];
            var dataExtent = visualMapModel.getExtent();

            // For hover link show when hover handle, which might be below or upper than sizeExtent.
            cursorPos = mathMin(mathMax(sizeExtent[0], cursorPos), sizeExtent[1]);

            var halfHoverLinkSize = getHalfHoverLinkSize(visualMapModel, dataExtent, sizeExtent);
            var hoverRange = [cursorPos - halfHoverLinkSize, cursorPos + halfHoverLinkSize];
            var cursorValue = linearMap(cursorPos, sizeExtent, dataExtent, true);
            var valueRange = [
                linearMap(hoverRange[0], sizeExtent, dataExtent, true),
                linearMap(hoverRange[1], sizeExtent, dataExtent, true)
            ];
            // Consider data range is out of visualMap range, see test/visualMap-continuous.html,
            // where china and india has very large population.
            hoverRange[0] < sizeExtent[0] && (valueRange[0] = -Infinity);
            hoverRange[1] > sizeExtent[1] && (valueRange[1] = Infinity);

            // Do not show indicator when mouse is over handle,
            // otherwise labels overlap, especially when dragging.
            if (hoverOnBar) {
                if (valueRange[0] === -Infinity) {
                    this._showIndicator(cursorValue, valueRange[1], '< ', halfHoverLinkSize);
                }
                else if (valueRange[1] === Infinity) {
                    this._showIndicator(cursorValue, valueRange[0], '> ', halfHoverLinkSize);
                }
                else {
                    this._showIndicator(cursorValue, cursorValue, '≈ ', halfHoverLinkSize);
                }
            }

            // When realtime is set as false, handles, which are in barGroup,
            // also trigger hoverLink, which help user to realize where they
            // focus on when dragging. (see test/heatmap-large.html)
            // When realtime is set as true, highlight will not show when hover
            // handle, because the label on handle, which displays a exact value
            // but not range, might mislead users.
            var oldBatch = this._hoverLinkDataIndices;
            var newBatch = [];
            if (hoverOnBar || useHoverLinkOnHandle(visualMapModel)) {
                newBatch = this._hoverLinkDataIndices = visualMapModel.findTargetDataIndices(valueRange);
            }

            var resultBatches = modelUtil.compressBatches(oldBatch, newBatch);

            this._dispatchHighDown('downplay', helper.convertDataIndex(resultBatches[0]));
            this._dispatchHighDown('highlight', helper.convertDataIndex(resultBatches[1]));
        },

        /**
         * @private
         */
        _hoverLinkFromSeriesMouseOver: function (e) {
            var el = e.target;
            var visualMapModel = this.visualMapModel;

            if (!el || el.dataIndex == null) {
                return;
            }

            var dataModel = this.ecModel.getSeriesByIndex(el.seriesIndex);

            if (!visualMapModel.isTargetSeries(dataModel)) {
                return;
            }

            var data = dataModel.getData(el.dataType);
            var dim = data.getDimension(visualMapModel.getDataDimension(data));
            var value = data.get(dim, el.dataIndex, true);

            if (!isNaN(value)) {
                this._showIndicator(value, value);
            }
        },

        /**
         * @private
         */
        _hideIndicator: function () {
            var shapes = this._shapes;
            shapes.indicator && shapes.indicator.attr('invisible', true);
            shapes.indicatorLabel && shapes.indicatorLabel.attr('invisible', true);
        },

        /**
         * @private
         */
        _clearHoverLinkToSeries: function () {
            this._hideIndicator();

            var indices = this._hoverLinkDataIndices;
            this._dispatchHighDown('downplay', helper.convertDataIndex(indices));

            indices.length = 0;
        },

        /**
         * @private
         */
        _clearHoverLinkFromSeries: function () {
            this._hideIndicator();

            var zr = this.api.getZr();
            zr.off('mouseover', this._hoverLinkFromSeriesMouseOver);
            zr.off('mouseout', this._hideIndicator);
        },

        /**
         * @private
         */
        _applyTransform: function (vertex, element, inverse, global) {
            var transform = graphic.getTransform(element, global ? null : this.group);

            return graphic[
                zrUtil.isArray(vertex) ? 'applyTransform' : 'transformDirection'
            ](vertex, transform, inverse);
        },

        /**
         * @private
         */
        _dispatchHighDown: function (type, batch) {
            batch && batch.length && this.api.dispatchAction({
                type: type,
                batch: batch
            });
        },

        /**
         * @override
         */
        dispose: function () {
            this._clearHoverLinkFromSeries();
            this._clearHoverLinkToSeries();
        },

        /**
         * @override
         */
        remove: function () {
            this._clearHoverLinkFromSeries();
            this._clearHoverLinkToSeries();
        }

    });

    function createPolygon(points, cursor, onDrift, onDragEnd) {
        return new graphic.Polygon({
            shape: {points: points},
            draggable: !!onDrift,
            cursor: cursor,
            drift: onDrift,
            onmousemove: function (e) {
                // Fot mobile devicem, prevent screen slider on the button.
                eventTool.stop(e.event);
            },
            ondragend: onDragEnd
        });
    }

    function createHandlePoints(handleIndex, textSize) {
        return handleIndex === 0
            ? [[0, 0], [textSize, 0], [textSize, -textSize]]
            : [[0, 0], [textSize, 0], [textSize, textSize]];
    }

    function createIndicatorPoints(isRange, halfHoverLinkSize, pos, extentMax) {
        return isRange
            ? [ // indicate range
                [0, -mathMin(halfHoverLinkSize, mathMax(pos, 0))],
                [HOVER_LINK_OUT, 0],
                [0, mathMin(halfHoverLinkSize, mathMax(extentMax - pos, 0))]
            ]
            : [ // indicate single value
                [0, 0], [5, -5], [5, 5]
            ];
    }

    function getHalfHoverLinkSize(visualMapModel, dataExtent, sizeExtent) {
        var halfHoverLinkSize = HOVER_LINK_SIZE / 2;
        var hoverLinkDataSize = visualMapModel.get('hoverLinkDataSize');
        if (hoverLinkDataSize) {
            halfHoverLinkSize = linearMap(hoverLinkDataSize, dataExtent, sizeExtent, true) / 2;
        }
        return halfHoverLinkSize;
    }

    function useHoverLinkOnHandle(visualMapModel) {
        var hoverLinkOnHandle = visualMapModel.get('hoverLinkOnHandle');
        return !!(hoverLinkOnHandle == null ? visualMapModel.get('realtime') : hoverLinkOnHandle);
    }

    function getCursor(orient) {
        return orient === 'vertical' ? 'ns-resize' : 'ew-resize';
    }

    module.exports = ContinuousView;



/***/ }),

/***/ 851:
/***/ (function(module, exports, __webpack_require__) {



    var VisualMapModel = __webpack_require__(361);
    var zrUtil = __webpack_require__(2);
    var VisualMapping = __webpack_require__(150);
    var visualDefault = __webpack_require__(379);
    var reformIntervals = __webpack_require__(24).reformIntervals;

    var PiecewiseModel = VisualMapModel.extend({

        type: 'visualMap.piecewise',

        /**
         * Order Rule:
         *
         * option.categories / option.pieces / option.text / option.selected:
         *     If !option.inverse,
         *     Order when vertical: ['top', ..., 'bottom'].
         *     Order when horizontal: ['left', ..., 'right'].
         *     If option.inverse, the meaning of
         *     the order should be reversed.
         *
         * this._pieceList:
         *     The order is always [low, ..., high].
         *
         * Mapping from location to low-high:
         *     If !option.inverse
         *     When vertical, top is high.
         *     When horizontal, right is high.
         *     If option.inverse, reverse.
         */

        /**
         * @protected
         */
        defaultOption: {
            selected: null,             // Object. If not specified, means selected.
                                        // When pieces and splitNumber: {'0': true, '5': true}
                                        // When categories: {'cate1': false, 'cate3': true}
                                        // When selected === false, means all unselected.

            minOpen: false,             // Whether include values that smaller than `min`.
            maxOpen: false,             // Whether include values that bigger than `max`.

            align: 'auto',              // 'auto', 'left', 'right'
            itemWidth: 20,              // When put the controller vertically, it is the length of
                                        // horizontal side of each item. Otherwise, vertical side.
            itemHeight: 14,             // When put the controller vertically, it is the length of
                                        // vertical side of each item. Otherwise, horizontal side.
            itemSymbol: 'roundRect',
            pieceList: null,            // Each item is Object, with some of those attrs:
                                        // {min, max, lt, gt, lte, gte, value,
                                        // color, colorSaturation, colorAlpha, opacity,
                                        // symbol, symbolSize}, which customize the range or visual
                                        // coding of the certain piece. Besides, see "Order Rule".
            categories: null,           // category names, like: ['some1', 'some2', 'some3'].
                                        // Attr min/max are ignored when categories set. See "Order Rule"
            splitNumber: 5,             // If set to 5, auto split five pieces equally.
                                        // If set to 0 and component type not set, component type will be
                                        // determined as "continuous". (It is less reasonable but for ec2
                                        // compatibility, see echarts/component/visualMap/typeDefaulter)
            selectedMode: 'multiple',   // Can be 'multiple' or 'single'.
            itemGap: 10,                // The gap between two items, in px.
            hoverLink: true,            // Enable hover highlight.

            showLabel: null             // By default, when text is used, label will hide (the logic
                                        // is remained for compatibility reason)
        },

        /**
         * @override
         */
        optionUpdated: function (newOption, isInit) {
            PiecewiseModel.superApply(this, 'optionUpdated', arguments);

            /**
             * The order is always [low, ..., high].
             * [{text: string, interval: Array.<number>}, ...]
             * @private
             * @type {Array.<Object>}
             */
            this._pieceList = [];

            this.resetExtent();

            /**
             * 'pieces', 'categories', 'splitNumber'
             * @type {string}
             */
            var mode = this._mode = this._determineMode();

            resetMethods[this._mode].call(this);

            this._resetSelected(newOption, isInit);

            var categories = this.option.categories;

            this.resetVisual(function (mappingOption, state) {
                if (mode === 'categories') {
                    mappingOption.mappingMethod = 'category';
                    mappingOption.categories = zrUtil.clone(categories);
                }
                else {
                    mappingOption.dataExtent = this.getExtent();
                    mappingOption.mappingMethod = 'piecewise';
                    mappingOption.pieceList = zrUtil.map(this._pieceList, function (piece) {
                        var piece = zrUtil.clone(piece);
                        if (state !== 'inRange') {
                            // FIXME
                            // outOfRange do not support special visual in pieces.
                            piece.visual = null;
                        }
                        return piece;
                    });
                }
            });
        },

        /**
         * @protected
         * @override
         */
        completeVisualOption: function () {
            // Consider this case:
            // visualMap: {
            //      pieces: [{symbol: 'circle', lt: 0}, {symbol: 'rect', gte: 0}]
            // }
            // where no inRange/outOfRange set but only pieces. So we should make
            // default inRange/outOfRange for this case, otherwise visuals that only
            // appear in `pieces` will not be taken into account in visual encoding.

            var option = this.option;
            var visualTypesInPieces = {};
            var visualTypes = VisualMapping.listVisualTypes();
            var isCategory = this.isCategory();

            zrUtil.each(option.pieces, function (piece) {
                zrUtil.each(visualTypes, function (visualType) {
                    if (piece.hasOwnProperty(visualType)) {
                        visualTypesInPieces[visualType] = 1;
                    }
                });
            });

            zrUtil.each(visualTypesInPieces, function (v, visualType) {
                var exists = 0;
                zrUtil.each(this.stateList, function (state) {
                    exists |= has(option, state, visualType)
                        || has(option.target, state, visualType);
                }, this);

                !exists && zrUtil.each(this.stateList, function (state) {
                    (option[state] || (option[state] = {}))[visualType] = visualDefault.get(
                        visualType, state === 'inRange' ? 'active' : 'inactive', isCategory
                    );
                });
            }, this);

            function has(obj, state, visualType) {
                return obj && obj[state] && (
                    zrUtil.isObject(obj[state])
                        ? obj[state].hasOwnProperty(visualType)
                        : obj[state] === visualType // e.g., inRange: 'symbol'
                );
            }

            VisualMapModel.prototype.completeVisualOption.apply(this, arguments);
        },

        _resetSelected: function (newOption, isInit) {
            var thisOption = this.option;
            var pieceList = this._pieceList;

            // Selected do not merge but all override.
            var selected = (isInit ? thisOption : newOption).selected || {};
            thisOption.selected = selected;

            // Consider 'not specified' means true.
            zrUtil.each(pieceList, function (piece, index) {
                var key = this.getSelectedMapKey(piece);
                if (!selected.hasOwnProperty(key)) {
                    selected[key] = true;
                }
            }, this);

            if (thisOption.selectedMode === 'single') {
                // Ensure there is only one selected.
                var hasSel = false;

                zrUtil.each(pieceList, function (piece, index) {
                    var key = this.getSelectedMapKey(piece);
                    if (selected[key]) {
                        hasSel
                            ? (selected[key] = false)
                            : (hasSel = true);
                    }
                }, this);
            }
            // thisOption.selectedMode === 'multiple', default: all selected.
        },

        /**
         * @public
         */
        getSelectedMapKey: function (piece) {
            return this._mode === 'categories'
                ? piece.value + '' : piece.index + '';
        },

        /**
         * @public
         */
        getPieceList: function () {
            return this._pieceList;
        },

        /**
         * @private
         * @return {string}
         */
        _determineMode: function () {
            var option = this.option;

            return option.pieces && option.pieces.length > 0
                ? 'pieces'
                : this.option.categories
                ? 'categories'
                : 'splitNumber';
        },

        /**
         * @public
         * @override
         */
        setSelected: function (selected) {
            this.option.selected = zrUtil.clone(selected);
        },

        /**
         * @public
         * @override
         */
        getValueState: function (value) {
            var index = VisualMapping.findPieceIndex(value, this._pieceList);

            return index != null
                ? (this.option.selected[this.getSelectedMapKey(this._pieceList[index])]
                    ? 'inRange' : 'outOfRange'
                )
                : 'outOfRange';
        },

        /**
         * @public
         * @params {number} pieceIndex piece index in visualMapModel.getPieceList()
         * @return {Array.<Object>} [{seriesId, dataIndices: <Array.<number>>}, ...]
         */
        findTargetDataIndices: function (pieceIndex) {
            var result = [];

            this.eachTargetSeries(function (seriesModel) {
                var dataIndices = [];
                var data = seriesModel.getData();

                data.each(this.getDataDimension(data), function (value, dataIndex) {
                    // Should always base on model pieceList, because it is order sensitive.
                    var pIdx = VisualMapping.findPieceIndex(value, this._pieceList);
                    pIdx === pieceIndex && dataIndices.push(dataIndex);
                }, true, this);

                result.push({seriesId: seriesModel.id, dataIndex: dataIndices});
            }, this);

            return result;
        },

        /**
         * @private
         * @param {Object} piece piece.value or piece.interval is required.
         * @return {number} Can be Infinity or -Infinity
         */
        getRepresentValue: function (piece) {
            var representValue;
            if (this.isCategory()) {
                representValue = piece.value;
            }
            else {
                if (piece.value != null) {
                    representValue = piece.value;
                }
                else {
                    var pieceInterval = piece.interval || [];
                    representValue = (pieceInterval[0] === -Infinity && pieceInterval[1] === Infinity)
                        ? 0
                        : (pieceInterval[0] + pieceInterval[1]) / 2;
                }
            }
            return representValue;
        },

        getVisualMeta: function (getColorVisual) {
            // Do not support category. (category axis is ordinal, numerical)
            if (this.isCategory()) {
                return;
            }

            var stops = [];
            var outerColors = [];
            var visualMapModel = this;

            function setStop(interval, valueState) {
                var representValue = visualMapModel.getRepresentValue({interval: interval});
                if (!valueState) {
                    valueState = visualMapModel.getValueState(representValue);
                }
                var color = getColorVisual(representValue, valueState);
                if (interval[0] === -Infinity) {
                    outerColors[0] = color;
                }
                else if (interval[1] === Infinity) {
                    outerColors[1] = color;
                }
                else {
                    stops.push(
                        {value: interval[0], color: color},
                        {value: interval[1], color: color}
                    );
                }
            }

            // Suplement
            var pieceList = this._pieceList.slice();
            if (!pieceList.length) {
                pieceList.push({interval: [-Infinity, Infinity]});
            }
            else {
                var edge = pieceList[0].interval[0];
                edge !== -Infinity && pieceList.unshift({interval: [-Infinity, edge]});
                edge = pieceList[pieceList.length - 1].interval[1];
                edge !== Infinity && pieceList.push({interval: [edge, Infinity]});
            }

            var curr = -Infinity;
            zrUtil.each(pieceList, function (piece) {
                var interval = piece.interval;
                if (interval) {
                    // Fulfill gap.
                    interval[0] > curr && setStop([curr, interval[0]], 'outOfRange');
                    setStop(interval.slice());
                    curr = interval[1];
                }
            }, this);

            return {stops: stops, outerColors: outerColors};
        }

    });

    /**
     * Key is this._mode
     * @type {Object}
     * @this {module:echarts/component/viusalMap/PiecewiseMode}
     */
    var resetMethods = {

        splitNumber: function () {
            var thisOption = this.option;
            var pieceList = this._pieceList;
            var precision = Math.min(thisOption.precision, 20);
            var dataExtent = this.getExtent();
            var splitNumber = thisOption.splitNumber;
            splitNumber = Math.max(parseInt(splitNumber, 10), 1);
            thisOption.splitNumber = splitNumber;

            var splitStep = (dataExtent[1] - dataExtent[0]) / splitNumber;
            // Precision auto-adaption
            while (+splitStep.toFixed(precision) !== splitStep && precision < 5) {
                precision++;
            }
            thisOption.precision = precision;
            splitStep = +splitStep.toFixed(precision);

            var index = 0;

            if (thisOption.minOpen) {
                pieceList.push({
                    index: index++,
                    interval: [-Infinity, dataExtent[0]],
                    close: [0, 0]
                });
            }

            for (
                var curr = dataExtent[0], len = index + splitNumber;
                index < len;
                curr += splitStep
            ) {
                var max = index === splitNumber - 1 ? dataExtent[1] : (curr + splitStep);

                pieceList.push({
                    index: index++,
                    interval: [curr, max],
                    close: [1, 1]
                });
            }

            if (thisOption.maxOpen) {
                pieceList.push({
                    index: index++,
                    interval: [dataExtent[1], Infinity],
                    close: [0, 0]
                });
            }

            reformIntervals(pieceList);

            zrUtil.each(pieceList, function (piece) {
                piece.text = this.formatValueText(piece.interval);
            }, this);
        },

        categories: function () {
            var thisOption = this.option;
            zrUtil.each(thisOption.categories, function (cate) {
                // FIXME category模式也使用pieceList，但在visualMapping中不是使用pieceList。
                // 是否改一致。
                this._pieceList.push({
                    text: this.formatValueText(cate, true),
                    value: cate
                });
            }, this);

            // See "Order Rule".
            normalizeReverse(thisOption, this._pieceList);
        },

        pieces: function () {
            var thisOption = this.option;
            var pieceList = this._pieceList;

            zrUtil.each(thisOption.pieces, function (pieceListItem, index) {

                if (!zrUtil.isObject(pieceListItem)) {
                    pieceListItem = {value: pieceListItem};
                }

                var item = {text: '', index: index};

                if (pieceListItem.label != null) {
                    item.text = pieceListItem.label;
                }

                if (pieceListItem.hasOwnProperty('value')) {
                    var value = item.value = pieceListItem.value;
                    item.interval = [value, value];
                    item.close = [1, 1];
                }
                else {
                    // `min` `max` is legacy option.
                    // `lt` `gt` `lte` `gte` is recommanded.
                    var interval = item.interval = [];
                    var close = item.close = [0, 0];

                    var closeList = [1, 0, 1];
                    var infinityList = [-Infinity, Infinity];

                    var useMinMax = [];
                    for (var lg = 0; lg < 2; lg++) {
                        var names = [['gte', 'gt', 'min'], ['lte', 'lt', 'max']][lg];
                        for (var i = 0; i < 3 && interval[lg] == null; i++) {
                            interval[lg] = pieceListItem[names[i]];
                            close[lg] = closeList[i];
                            useMinMax[lg] = i === 2;
                        }
                        interval[lg] == null && (interval[lg] = infinityList[lg]);
                    }
                    useMinMax[0] && interval[1] === Infinity && (close[0] = 0);
                    useMinMax[1] && interval[0] === -Infinity && (close[1] = 0);

                    if (__DEV__) {
                        if (interval[0] > interval[1]) {
                            console.warn(
                                'Piece ' + index + 'is illegal: ' + interval
                                + ' lower bound should not greater then uppper bound.'
                            );
                        }
                    }

                    if (interval[0] === interval[1] && close[0] && close[1]) {
                        // Consider: [{min: 5, max: 5, visual: {...}}, {min: 0, max: 5}],
                        // we use value to lift the priority when min === max
                        item.value = interval[0];
                    }
                }

                item.visual = VisualMapping.retrieveVisuals(pieceListItem);

                pieceList.push(item);

            }, this);

            // See "Order Rule".
            normalizeReverse(thisOption, pieceList);
            // Only pieces
            reformIntervals(pieceList);

            zrUtil.each(pieceList, function (piece) {
                var close = piece.close;
                var edgeSymbols = [['<', '≤'][close[1]], ['>', '≥'][close[0]]];
                piece.text = piece.text || this.formatValueText(
                    piece.value != null ? piece.value : piece.interval,
                    false,
                    edgeSymbols
                );
            }, this);
        }
    };

    function normalizeReverse(thisOption, pieceList) {
        var inverse = thisOption.inverse;
        if (thisOption.orient === 'vertical' ? !inverse : inverse) {
             pieceList.reverse();
        }
    }

    module.exports = PiecewiseModel;


/***/ }),

/***/ 852:
/***/ (function(module, exports, __webpack_require__) {



    var VisualMapView = __webpack_require__(362);
    var zrUtil = __webpack_require__(2);
    var graphic = __webpack_require__(17);
    var symbolCreators = __webpack_require__(250);
    var layout = __webpack_require__(45);
    var helper = __webpack_require__(363);

    var PiecewiseVisualMapView = VisualMapView.extend({

        type: 'visualMap.piecewise',

        /**
         * @protected
         * @override
         */
        doRender: function () {
            var thisGroup = this.group;

            thisGroup.removeAll();

            var visualMapModel = this.visualMapModel;
            var textGap = visualMapModel.get('textGap');
            var textStyleModel = visualMapModel.textStyleModel;
            var textFont = textStyleModel.getFont();
            var textFill = textStyleModel.getTextColor();
            var itemAlign = this._getItemAlign();
            var itemSize = visualMapModel.itemSize;
            var viewData = this._getViewData();
            var endsText = viewData.endsText;
            var showLabel = zrUtil.retrieve(visualMapModel.get('showLabel', true), !endsText);

            endsText && this._renderEndsText(
                thisGroup, endsText[0], itemSize, showLabel, itemAlign
            );

            zrUtil.each(viewData.viewPieceList, renderItem, this);

            endsText && this._renderEndsText(
                thisGroup, endsText[1], itemSize, showLabel, itemAlign
            );

            layout.box(
                visualMapModel.get('orient'), thisGroup, visualMapModel.get('itemGap')
            );

            this.renderBackground(thisGroup);

            this.positionGroup(thisGroup);

            function renderItem(item) {
                var piece = item.piece;

                var itemGroup = new graphic.Group();
                itemGroup.onclick = zrUtil.bind(this._onItemClick, this, piece);

                this._enableHoverLink(itemGroup, item.indexInModelPieceList);

                var representValue = visualMapModel.getRepresentValue(piece);

                this._createItemSymbol(
                    itemGroup, representValue, [0, 0, itemSize[0], itemSize[1]]
                );

                if (showLabel) {
                    var visualState = this.visualMapModel.getValueState(representValue);

                    itemGroup.add(new graphic.Text({
                        style: {
                            x: itemAlign === 'right' ? -textGap : itemSize[0] + textGap,
                            y: itemSize[1] / 2,
                            text: piece.text,
                            textVerticalAlign: 'middle',
                            textAlign: itemAlign,
                            textFont: textFont,
                            textFill: textFill,
                            opacity: visualState === 'outOfRange' ? 0.5 : 1
                        }
                    }));
                }

                thisGroup.add(itemGroup);
            }
        },

        /**
         * @private
         */
        _enableHoverLink: function (itemGroup, pieceIndex) {
            itemGroup
                .on('mouseover', zrUtil.bind(onHoverLink, this, 'highlight'))
                .on('mouseout', zrUtil.bind(onHoverLink, this, 'downplay'));

            function onHoverLink(method) {
                var visualMapModel = this.visualMapModel;

                visualMapModel.option.hoverLink && this.api.dispatchAction({
                    type: method,
                    batch: helper.convertDataIndex(
                        visualMapModel.findTargetDataIndices(pieceIndex)
                    )
                });
            }
        },

        /**
         * @private
         */
        _getItemAlign: function () {
            var visualMapModel = this.visualMapModel;
            var modelOption = visualMapModel.option;

            if (modelOption.orient === 'vertical') {
                return helper.getItemAlign(
                    visualMapModel, this.api, visualMapModel.itemSize
                );
            }
            else { // horizontal, most case left unless specifying right.
                var align = modelOption.align;
                if (!align || align === 'auto') {
                    align = 'left';
                }
                return align;
            }
        },

        /**
         * @private
         */
        _renderEndsText: function (group, text, itemSize, showLabel, itemAlign) {
            if (!text) {
                return;
            }

            var itemGroup = new graphic.Group();
            var textStyleModel = this.visualMapModel.textStyleModel;

            itemGroup.add(new graphic.Text({
                style: {
                    x: showLabel ? (itemAlign === 'right' ? itemSize[0] : 0) : itemSize[0] / 2,
                    y: itemSize[1] / 2,
                    textVerticalAlign: 'middle',
                    textAlign: showLabel ? itemAlign : 'center',
                    text: text,
                    textFont: textStyleModel.getFont(),
                    textFill: textStyleModel.getTextColor()
                }
            }));

            group.add(itemGroup);
        },

        /**
         * @private
         * @return {Object} {peiceList, endsText} The order is the same as screen pixel order.
         */
        _getViewData: function () {
            var visualMapModel = this.visualMapModel;

            var viewPieceList = zrUtil.map(visualMapModel.getPieceList(), function (piece, index) {
                return {piece: piece, indexInModelPieceList: index};
            });
            var endsText = visualMapModel.get('text');

            // Consider orient and inverse.
            var orient = visualMapModel.get('orient');
            var inverse = visualMapModel.get('inverse');

            // Order of model pieceList is always [low, ..., high]
            if (orient === 'horizontal' ? inverse : !inverse) {
                viewPieceList.reverse();
            }
            // Origin order of endsText is [high, low]
            else if (endsText) {
                endsText = endsText.slice().reverse();
            }

            return {viewPieceList: viewPieceList, endsText: endsText};
        },

        /**
         * @private
         */
        _createItemSymbol: function (group, representValue, shapeParam) {
            group.add(symbolCreators.createSymbol(
                this.getControllerVisual(representValue, 'symbol'),
                shapeParam[0], shapeParam[1], shapeParam[2], shapeParam[3],
                this.getControllerVisual(representValue, 'color')
            ));
        },

        /**
         * @private
         */
        _onItemClick: function (piece) {
            var visualMapModel = this.visualMapModel;
            var option = visualMapModel.option;
            var selected = zrUtil.clone(option.selected);
            var newKey = visualMapModel.getSelectedMapKey(piece);

            if (option.selectedMode === 'single') {
                selected[newKey] = true;
                zrUtil.each(selected, function (o, key) {
                    selected[key] = key === newKey;
                });
            }
            else {
                selected[newKey] = !selected[newKey];
            }

            this.api.dispatchAction({
                type: 'selectDataRange',
                from: this.uid,
                visualMapId: this.visualMapModel.id,
                selected: selected
            });
        }
    });

    module.exports = PiecewiseVisualMapView;



/***/ }),

/***/ 853:
/***/ (function(module, exports, __webpack_require__) {

/**
 * Simple view coordinate system
 * Mapping given x, y to transformd view x, y
 */


    var vector = __webpack_require__(43);
    var matrix = __webpack_require__(124);

    var Transformable = __webpack_require__(311);
    var zrUtil = __webpack_require__(2);

    var BoundingRect = __webpack_require__(57);

    var v2ApplyTransform = vector.applyTransform;

    // Dummy transform node
    function TransformDummy() {
        Transformable.call(this);
    }
    zrUtil.mixin(TransformDummy, Transformable);

    function View(name) {
        /**
         * @type {string}
         */
        this.name = name;

        /**
         * @type {Object}
         */
        this.zoomLimit;

        Transformable.call(this);

        this._roamTransform = new TransformDummy();

        this._viewTransform = new TransformDummy();

        this._center;
        this._zoom;
    }

    View.prototype = {

        constructor: View,

        type: 'view',

        /**
         * @param {Array.<string>}
         * @readOnly
         */
        dimensions: ['x', 'y'],

        /**
         * Set bounding rect
         * @param {number} x
         * @param {number} y
         * @param {number} width
         * @param {number} height
         */

        // PENDING to getRect
        setBoundingRect: function (x, y, width, height) {
            this._rect = new BoundingRect(x, y, width, height);
            return this._rect;
        },

        /**
         * @return {module:zrender/core/BoundingRect}
         */
        // PENDING to getRect
        getBoundingRect: function () {
            return this._rect;
        },

        /**
         * @param {number} x
         * @param {number} y
         * @param {number} width
         * @param {number} height
         */
        setViewRect: function (x, y, width, height) {
            this.transformTo(x, y, width, height);
            this._viewRect = new BoundingRect(x, y, width, height);
        },

        /**
         * Transformed to particular position and size
         * @param {number} x
         * @param {number} y
         * @param {number} width
         * @param {number} height
         */
        transformTo: function (x, y, width, height) {
            var rect = this.getBoundingRect();
            var viewTransform = this._viewTransform;

            viewTransform.transform = rect.calculateTransform(
                new BoundingRect(x, y, width, height)
            );

            viewTransform.decomposeTransform();

            this._updateTransform();
        },

        /**
         * Set center of view
         * @param {Array.<number>} [centerCoord]
         */
        setCenter: function (centerCoord) {
            if (!centerCoord) {
                return;
            }
            this._center = centerCoord;

            this._updateCenterAndZoom();
        },

        /**
         * @param {number} zoom
         */
        setZoom: function (zoom) {
            zoom = zoom || 1;

            var zoomLimit = this.zoomLimit;
            if (zoomLimit) {
                if (zoomLimit.max != null) {
                    zoom = Math.min(zoomLimit.max, zoom);
                }
                if (zoomLimit.min != null) {
                    zoom = Math.max(zoomLimit.min, zoom);
                }
            }
            this._zoom = zoom;

            this._updateCenterAndZoom();
        },

        /**
         * Get default center without roam
         */
        getDefaultCenter: function () {
            // Rect before any transform
            var rawRect = this.getBoundingRect();
            var cx = rawRect.x + rawRect.width / 2;
            var cy = rawRect.y + rawRect.height / 2;

            return [cx, cy];
        },

        getCenter: function () {
            return this._center || this.getDefaultCenter();
        },

        getZoom: function () {
            return this._zoom || 1;
        },

        /**
         * @return {Array.<number}
         */
        getRoamTransform: function () {
            return this._roamTransform;
        },

        _updateCenterAndZoom: function () {
            // Must update after view transform updated
            var viewTransformMatrix = this._viewTransform.getLocalTransform();
            var roamTransform = this._roamTransform;
            var defaultCenter = this.getDefaultCenter();
            var center = this.getCenter();
            var zoom = this.getZoom();

            center = vector.applyTransform([], center, viewTransformMatrix);
            defaultCenter = vector.applyTransform([], defaultCenter, viewTransformMatrix);

            roamTransform.origin = center;
            roamTransform.position = [
                defaultCenter[0] - center[0],
                defaultCenter[1] - center[1]
            ];
            roamTransform.scale = [zoom, zoom];

            this._updateTransform();
        },

        /**
         * Update transform from roam and mapLocation
         * @private
         */
        _updateTransform: function () {
            var roamTransform = this._roamTransform;
            var viewTransform = this._viewTransform;

            viewTransform.parent = roamTransform;
            roamTransform.updateTransform();
            viewTransform.updateTransform();

            viewTransform.transform
                && matrix.copy(this.transform || (this.transform = []), viewTransform.transform);

            if (this.transform) {
                this.invTransform = this.invTransform || [];
                matrix.invert(this.invTransform, this.transform);
            }
            else {
                this.invTransform = null;
            }
            this.decomposeTransform();
        },

        /**
         * @return {module:zrender/core/BoundingRect}
         */
        getViewRect: function () {
            return this._viewRect;
        },

        /**
         * Get view rect after roam transform
         * @return {module:zrender/core/BoundingRect}
         */
        getViewRectAfterRoam: function () {
            var rect = this.getBoundingRect().clone();
            rect.applyTransform(this.transform);
            return rect;
        },

        /**
         * Convert a single (lon, lat) data item to (x, y) point.
         * @param {Array.<number>} data
         * @return {Array.<number>}
         */
        dataToPoint: function (data) {
            var transform = this.transform;
            return transform
                ? v2ApplyTransform([], data, transform)
                : [data[0], data[1]];
        },

        /**
         * Convert a (x, y) point to (lon, lat) data
         * @param {Array.<number>} point
         * @return {Array.<number>}
         */
        pointToData: function (point) {
            var invTransform = this.invTransform;
            return invTransform
                ? v2ApplyTransform([], point, invTransform)
                : [point[0], point[1]];
        },

        /**
         * @implements
         * see {module:echarts/CoodinateSystem}
         */
        convertToPixel: zrUtil.curry(doConvert, 'dataToPoint'),

        /**
         * @implements
         * see {module:echarts/CoodinateSystem}
         */
        convertFromPixel: zrUtil.curry(doConvert, 'pointToData'),

        /**
         * @implements
         * see {module:echarts/CoodinateSystem}
         */
        containPoint: function (point) {
            return this.getViewRectAfterRoam().contain(point[0], point[1]);
        }

        /**
         * @return {number}
         */
        // getScalarScale: function () {
        //     // Use determinant square root of transform to mutiply scalar
        //     var m = this.transform;
        //     var det = Math.sqrt(Math.abs(m[0] * m[3] - m[2] * m[1]));
        //     return det;
        // }
    };

    zrUtil.mixin(View, Transformable);

    function doConvert(methodName, ecModel, finder, value) {
        var seriesModel = finder.seriesModel;
        var coordSys = seriesModel ? seriesModel.coordinateSystem : null; // e.g., graph.
        return coordSys === this ? coordSys[methodName](value) : null;
    }

    module.exports = View;


/***/ }),

/***/ 860:
/***/ (function(module, exports, __webpack_require__) {



    var parseGeoJson = __webpack_require__(374);

    var zrUtil = __webpack_require__(2);

    var BoundingRect = __webpack_require__(57);

    var View = __webpack_require__(853);


    // Geo fix functions
    var geoFixFuncs = [
        __webpack_require__(863),
        __webpack_require__(864),
        __webpack_require__(862),
        __webpack_require__(861)
    ];

    /**
     * [Geo description]
     * @param {string} name Geo name
     * @param {string} map Map type
     * @param {Object} geoJson
     * @param {Object} [specialAreas]
     *        Specify the positioned areas by left, top, width, height
     * @param {Object.<string, string>} [nameMap]
     *        Specify name alias
     */
    function Geo(name, map, geoJson, specialAreas, nameMap) {

        View.call(this, name);

        /**
         * Map type
         * @type {string}
         */
        this.map = map;

        this._nameCoordMap = zrUtil.createHashMap();

        this.loadGeoJson(geoJson, specialAreas, nameMap);
    }

    Geo.prototype = {

        constructor: Geo,

        type: 'geo',

        /**
         * @param {Array.<string>}
         * @readOnly
         */
        dimensions: ['lng', 'lat'],

        /**
         * If contain given lng,lat coord
         * @param {Array.<number>}
         * @readOnly
         */
        containCoord: function (coord) {
            var regions = this.regions;
            for (var i = 0; i < regions.length; i++) {
                if (regions[i].contain(coord)) {
                    return true;
                }
            }
            return false;
        },
        /**
         * @param {Object} geoJson
         * @param {Object} [specialAreas]
         *        Specify the positioned areas by left, top, width, height
         * @param {Object.<string, string>} [nameMap]
         *        Specify name alias
         */
        loadGeoJson: function (geoJson, specialAreas, nameMap) {
            // https://jsperf.com/try-catch-performance-overhead
            try {
                this.regions = geoJson ? parseGeoJson(geoJson) : [];
            }
            catch (e) {
                throw 'Invalid geoJson format\n' + e.message;
            }
            specialAreas = specialAreas || {};
            nameMap = nameMap || {};
            var regions = this.regions;
            var regionsMap = zrUtil.createHashMap();
            for (var i = 0; i < regions.length; i++) {
                var regionName = regions[i].name;
                // Try use the alias in nameMap
                regionName = nameMap.hasOwnProperty(regionName) ? nameMap[regionName] : regionName;
                regions[i].name = regionName;

                regionsMap.set(regionName, regions[i]);
                // Add geoJson
                this.addGeoCoord(regionName, regions[i].center);

                // Some area like Alaska in USA map needs to be tansformed
                // to look better
                var specialArea = specialAreas[regionName];
                if (specialArea) {
                    regions[i].transformTo(
                        specialArea.left, specialArea.top, specialArea.width, specialArea.height
                    );
                }
            }

            this._regionsMap = regionsMap;

            this._rect = null;

            zrUtil.each(geoFixFuncs, function (fixFunc) {
                fixFunc(this);
            }, this);
        },

        // Overwrite
        transformTo: function (x, y, width, height) {
            var rect = this.getBoundingRect();

            rect = rect.clone();
            // Longitute is inverted
            rect.y = -rect.y - rect.height;

            var viewTransform = this._viewTransform;

            viewTransform.transform = rect.calculateTransform(
                new BoundingRect(x, y, width, height)
            );

            viewTransform.decomposeTransform();

            var scale = viewTransform.scale;
            scale[1] = -scale[1];

            viewTransform.updateTransform();

            this._updateTransform();
        },

        /**
         * @param {string} name
         * @return {module:echarts/coord/geo/Region}
         */
        getRegion: function (name) {
            return this._regionsMap.get(name);
        },

        getRegionByCoord: function (coord) {
            var regions = this.regions;
            for (var i = 0; i < regions.length; i++) {
                if (regions[i].contain(coord)) {
                    return regions[i];
                }
            }
        },

        /**
         * Add geoCoord for indexing by name
         * @param {string} name
         * @param {Array.<number>} geoCoord
         */
        addGeoCoord: function (name, geoCoord) {
            this._nameCoordMap.set(name, geoCoord);
        },

        /**
         * Get geoCoord by name
         * @param {string} name
         * @return {Array.<number>}
         */
        getGeoCoord: function (name) {
            return this._nameCoordMap.get(name);
        },

        // Overwrite
        getBoundingRect: function () {
            if (this._rect) {
                return this._rect;
            }
            var rect;

            var regions = this.regions;
            for (var i = 0; i < regions.length; i++) {
                var regionRect = regions[i].getBoundingRect();
                rect = rect || regionRect.clone();
                rect.union(regionRect);
            }
            // FIXME Always return new ?
            return (this._rect = rect || new BoundingRect(0, 0, 0, 0));
        },

        /**
         * @param {string|Array.<number>} data
         * @return {Array.<number>}
         */
        dataToPoint: function (data) {
            if (typeof data === 'string') {
                // Map area name to geoCoord
                data = this.getGeoCoord(data);
            }
            if (data) {
                return View.prototype.dataToPoint.call(this, data);
            }
        },

        /**
         * @inheritDoc
         */
        convertToPixel: zrUtil.curry(doConvert, 'dataToPoint'),

        /**
         * @inheritDoc
         */
        convertFromPixel: zrUtil.curry(doConvert, 'pointToData')

    };

    zrUtil.mixin(Geo, View);

    function doConvert(methodName, ecModel, finder, value) {
        var geoModel = finder.geoModel;
        var seriesModel = finder.seriesModel;

        var coordSys = geoModel
            ? geoModel.coordinateSystem
            : seriesModel
            ? (
                seriesModel.coordinateSystem // For map.
                || (seriesModel.getReferringComponents('geo')[0] || {}).coordinateSystem
            )
            : null;

        return coordSys === this ? coordSys[methodName](value) : null;
    }

    module.exports = Geo;


/***/ }),

/***/ 861:
/***/ (function(module, exports) {

// Fix for 钓鱼岛


    // var Region = require('../Region');
    // var zrUtil = require('zrender/lib/core/util');

    // var geoCoord = [126, 25];

    var points = [
        [
            [123.45165252685547, 25.73527164402261],
            [123.49731445312499, 25.73527164402261],
            [123.49731445312499, 25.750734064600884],
            [123.45165252685547, 25.750734064600884],
            [123.45165252685547, 25.73527164402261]
        ]
    ];
    module.exports = function (geo) {
        if (geo.map === 'china') {
            for (var i = 0, len = geo.regions.length; i < len; ++i) {
                if (geo.regions[i].name === '台湾') {
                    geo.regions[i].geometries.push({
                        type: 'polygon',
                        exterior: points[0]
                    });
                }
            }
        }
    };



/***/ }),

/***/ 862:
/***/ (function(module, exports, __webpack_require__) {



    var zrUtil = __webpack_require__(2);

    var geoCoordMap = {
        'Russia': [100, 60],
        'United States': [-99, 38],
        'United States of America': [-99, 38]
    };

    module.exports = function (geo) {
        zrUtil.each(geo.regions, function (region) {
            var geoCoord = geoCoordMap[region.name];
            if (geoCoord) {
                var cp = region.center;
                cp[0] = geoCoord[0];
                cp[1] = geoCoord[1];
            }
        });
    };


/***/ }),

/***/ 863:
/***/ (function(module, exports, __webpack_require__) {

// Fix for 南海诸岛


    var Region = __webpack_require__(372);
    var zrUtil = __webpack_require__(2);

    var geoCoord = [126, 25];

    var points = [
        [[0,3.5],[7,11.2],[15,11.9],[30,7],[42,0.7],[52,0.7],
         [56,7.7],[59,0.7],[64,0.7],[64,0],[5,0],[0,3.5]],
        [[13,16.1],[19,14.7],[16,21.7],[11,23.1],[13,16.1]],
        [[12,32.2],[14,38.5],[15,38.5],[13,32.2],[12,32.2]],
        [[16,47.6],[12,53.2],[13,53.2],[18,47.6],[16,47.6]],
        [[6,64.4],[8,70],[9,70],[8,64.4],[6,64.4]],
        [[23,82.6],[29,79.8],[30,79.8],[25,82.6],[23,82.6]],
        [[37,70.7],[43,62.3],[44,62.3],[39,70.7],[37,70.7]],
        [[48,51.1],[51,45.5],[53,45.5],[50,51.1],[48,51.1]],
        [[51,35],[51,28.7],[53,28.7],[53,35],[51,35]],
        [[52,22.4],[55,17.5],[56,17.5],[53,22.4],[52,22.4]],
        [[58,12.6],[62,7],[63,7],[60,12.6],[58,12.6]],
        [[0,3.5],[0,93.1],[64,93.1],[64,0],[63,0],[63,92.4],
         [1,92.4],[1,3.5],[0,3.5]]
    ];
    for (var i = 0; i < points.length; i++) {
        for (var k = 0; k < points[i].length; k++) {
            points[i][k][0] /= 10.5;
            points[i][k][1] /= -10.5 / 0.75;

            points[i][k][0] += geoCoord[0];
            points[i][k][1] += geoCoord[1];
        }
    }
    module.exports = function (geo) {
        if (geo.map === 'china') {
            geo.regions.push(new Region(
                '南海诸岛',
                zrUtil.map(points, function (exterior) {
                    return {
                        type: 'polygon',
                        exterior: exterior
                    };
                }), geoCoord
            ));
        }
    };


/***/ }),

/***/ 864:
/***/ (function(module, exports, __webpack_require__) {



    var zrUtil = __webpack_require__(2);

    var coordsOffsetMap = {
        '南海诸岛' : [32, 80],
        // 全国
        '广东': [0, -10],
        '香港': [10, 5],
        '澳门': [-10, 10],
        //'北京': [-10, 0],
        '天津': [5, 5]
    };

    module.exports = function (geo) {
        zrUtil.each(geo.regions, function (region) {
            var coordFix = coordsOffsetMap[region.name];
            if (coordFix) {
                var cp = region.center;
                cp[0] += coordFix[0] / 10.5;
                cp[1] += -coordFix[1] / (10.5 / 0.75);
            }
        });
    };


/***/ }),

/***/ 951:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1154]);
//# sourceMappingURL=4.js.map
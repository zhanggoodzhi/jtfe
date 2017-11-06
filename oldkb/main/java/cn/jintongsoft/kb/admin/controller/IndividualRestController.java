package cn.jintongsoft.kb.admin.controller;

import cn.jintongsoft.kb.admin.*;
import cn.jintongsoft.kb.api.onto.*;
import com.alibaba.dubbo.config.annotation.Reference;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/framework/individual")
@Slf4j
public class IndividualRestController {

    @Reference
    private OntoIndividualService ontoIndividualService;

    @PostMapping("/profile")
    public IndividualProfile getProfile(@SessionAttribute("appid") int appid, @RequestParam("uri") String uri) throws OntoServiceException {
        IndividualProfile profile = ontoIndividualService.getIndividualProfile(appid, uri);
        return profile;
    }

    @PostMapping("/create")
    public OntIndividual createIndividual(@SessionAttribute("appid") int appid, @RequestBody IndividualCreate data) throws OntoServiceException {
        String label = data.getLabel();
        String lang = data.getLang();
        String type = data.getType();

        KbIndividual individual = new KbIndividual(label, lang);
        individual.setType(type);
        individual = ontoIndividualService.createIndividual(appid, individual);

        OntIndividual idl = new OntIndividual(individual.getDisplayName(), individual.getUri());
        return idl;
    }

    @DeleteMapping
    public ResponseEntity<Void> removeIndividual(@SessionAttribute("appid") int appid, @RequestParam("iri") String uri)
        throws OntoServiceException {
        ontoIndividualService.removeIndividual(appid, uri);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/query")
    public List<KbResource> createIndividual(@SessionAttribute("appid") int appid, @RequestParam(value = "str", defaultValue = "") String queryStr) throws OntoServiceException {
        List<KbResource> list = ontoIndividualService.queryIndividualsByLabel(appid, queryStr);
        return list;
    }

    @GetMapping("/list")
    public List<OntIndividual> listOntIndividuals(@SessionAttribute("appid") int appid, @RequestParam(value = "uri", required = false) String uri)
        throws OntoServiceException {
        List<KbNamedIndividual> list = ontoIndividualService.listClassIndividuals(appid, uri);
        return list.stream().map(it -> {
            String displayName = it.getDisplayName();
            String iri = it.getUri();
            OntIndividual individual = new OntIndividual(displayName, iri);
            return individual;
        }).collect(Collectors.toList());
    }

    @DeleteMapping("/prop")
    public ResponseEntity<Void> removeProperty(@SessionAttribute("appid") int appid, @RequestBody IndividualPropDel data) throws OntoServiceException {
        int type = data.getType();
        String s = data.getIdl();
        String p = data.getProp();
        String o = data.getValue();
        String l = data.getLang();

        if (type == 1) {
            ontoIndividualService.removeObjectProperty(appid, s, p, o);
        } else if (type == 2) {
            ontoIndividualService.removeDatatypeProperty(appid, s, p, o, l);
        } else {
            throw new RuntimeException("不支持的类型:" + type);
        }

        return ResponseEntity.ok().build();
    }

    @PostMapping("/prop")
    public ResponseEntity<Void> addProperty(@SessionAttribute("appid") int appid, @RequestBody IndividualPropAdd data) throws OntoServiceException {
        int type = data.getType();
        String s = data.getIdl();
        String p = data.getProp();
        String o = data.getValue();
        String l = data.getLang();

        if (type == 1) {
            ontoIndividualService.addObjectProperty(appid, s, p, o);
        } else if (type == 2) {
            ontoIndividualService.addDataProperty(appid, s, p, o, l);
        } else {
            throw new RuntimeException("不支持的类型:" + type);
        }

        return ResponseEntity.ok().build();
    }

    @PostMapping("/type")
    public ResponseEntity<Void> addType(@SessionAttribute("appid") int appid, @RequestParam("idl") String uri, @RequestParam("cls") String type)
        throws OntoServiceException {
        ontoIndividualService.addTypeToIndividual(appid, uri, type);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/type")
    public ResponseEntity<Void> removeType(@SessionAttribute("appid") int appid, @RequestParam("idl") String uri, @RequestParam("cls") String type)
        throws OntoServiceException {
        ontoIndividualService.deleteTypeFromIndividual(appid, uri, type);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/same_as")
    public ResponseEntity<Void> addSameAs(@SessionAttribute("appid") int appid, @RequestParam("idl") String uri, @RequestParam("cls") String sameAs) throws OntoServiceException {
        ontoIndividualService.addSameAsToIndividual(appid, uri, sameAs);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/same_as")
    public ResponseEntity<Void> removeSameAs(@SessionAttribute("appid") int appid, @RequestParam("idl") String uri, @RequestParam("cls") String sameAs) throws OntoServiceException {
        ontoIndividualService.removeSameAsToIndividual(appid, uri, sameAs);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/props/keys")
    public List<CandidateProp> getCandidatePropsKeys(@SessionAttribute("appid") int appid, @RequestParam("idl") String idl) throws OntoServiceException {
        log.debug("idl=[{}]", idl);
        List<KbPropOption> types = ontoIndividualService.getIndividualSupportedPropsKeys(appid, idl);
        return types.stream().map(it -> {
            CandidateProp prop = new CandidateProp(it.getDisplayName(), it.getUri());
            prop.setType(it.getType());
            return prop;
        }).collect(Collectors.toList());
    }

    @GetMapping("/props/values")
    public List<CandidateProp> getCandidatePropsValues(@SessionAttribute("appid") int appid, @RequestParam("idl") String idl, @RequestParam("key") String key)
        throws OntoServiceException {
        log.debug("idl=[{}]", idl);
        List<KbPropOption> types = ontoIndividualService.getIndividualSupportedPropsValueOptions(appid, idl, key);
        return types.stream().map(it -> {
            CandidateProp prop = new CandidateProp(it.getDisplayName(), it.getUri());
            prop.setType(it.getType());
            return prop;
        }).collect(Collectors.toList());
    }
}

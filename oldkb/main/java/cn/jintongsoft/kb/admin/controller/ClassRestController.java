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
@RequestMapping("/api/framework/class")
@Slf4j
public class ClassRestController {

    @Reference
    private OntologyService ontologyService;

    @Reference
    private OntoClassService ontoClassService;

    @GetMapping("/thing")
    public KbThing listOntRootProps(@SessionAttribute("appid") int appid) throws OntoServiceException {
        KbThing thing = ontologyService.getThing(appid);
        return thing;
    }

    @GetMapping("/query")
    public List<KbResource> listAllOntClasses(@SessionAttribute("appid") int appid, @RequestParam(value = "str", defaultValue = "") String queryStr) throws OntoServiceException {
        List<KbResource> list = ontoClassService.queryClassByLabel(appid, queryStr);

        return list;
    }

    @PostMapping("/profile")
    public ClassProfile getProfile(@SessionAttribute("appid") int appid, @RequestParam("uri") String uri) throws OntoServiceException {
        ClassProfile profile = ontoClassService.getClassProfile(appid, uri);
        return profile;
    }

    @GetMapping("/sub_classes")
    public List<OntClass> listOntClasses(@SessionAttribute("appid") int appid, @RequestParam(value = "uri", required = false) String uri)
        throws OntoServiceException {
        List<KbSubClass> list = ontoClassService.getSubClasses(appid, uri);
        return list.stream().map(it -> {
            String displayName = it.getDisplayName();
            String iri = it.getUri();
            boolean hasSub = it.isHasSub();
            OntClass ontClass = new OntClass(displayName, iri, hasSub);
            return ontClass;
        }).collect(Collectors.toList());
    }

    @PostMapping("/create")
    public OntClass createClass(@SessionAttribute("appid") int appid, @RequestBody ClassCreate data) throws OntoServiceException {
        String label = data.getLabel();
        String lang = data.getLang();
        String subClassOf = data.getSubClassOf();

        KbOntClass clazz = new KbOntClass(label, lang);
        clazz.setSubClassOf(subClassOf);

        clazz = ontoClassService.createClass(appid, clazz);

        OntClass ontClass = new OntClass(clazz.getDisplayName(), clazz.getUri(), clazz.isHasSubClasses());
        return ontClass;
    }

    @DeleteMapping("/delete")
    public OntClass deleteClass(@SessionAttribute("appid") int appid, @RequestParam("iri") String uri) throws OntoServiceException {
        KbOntClass kbOntCls = ontoClassService.deleteClass(appid, uri);
        OntClass ontCls = new OntClass(kbOntCls.getDisplayName(), kbOntCls.getUri(), kbOntCls.isHasSubClasses());
        return ontCls;
    }

    @PutMapping("/sub_class_of")
    public OntClass updateSubClassOf(@SessionAttribute("appid") int appid, @RequestParam("iri") String uri, @RequestParam("super") String subClassOf)
        throws OntoServiceException {
        KbOntClass clazz = ontoClassService.updateSubClassOf(appid, uri, subClassOf);
        OntClass ontClass = new OntClass(clazz.getDisplayName(), clazz.getUri(), clazz.isHasSubClasses());
        return ontClass;
    }

    @PostMapping("/sub_class_of")
    public ResponseEntity<Void> addSubClassOf(@SessionAttribute("appid") int appid, @RequestParam("iri") String uri, @RequestParam("super") String subClassOf)
        throws OntoServiceException {
        ontoClassService.addSubClassOf(appid, uri, subClassOf);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/sub_class_of")
    public ResponseEntity<Void> removeSubClassOf(@SessionAttribute("appid") int appid, @RequestParam("iri") String uri, @RequestParam("super") String subClassOf)
        throws OntoServiceException {
        ontoClassService.removeSubClassOf(appid, uri, subClassOf);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/prop")
    public ResponseEntity<Void> removeProperty(@SessionAttribute("appid") int appid, @RequestBody ClassPropDel data) throws OntoServiceException {
        int type = data.getType();
        String s = data.getCls();
        String p = data.getProp();
        String o = data.getValue();
        String l = data.getLang();

        if (type == 1) {
            ontoClassService.removeClassObjectProperty(appid, s, p, o);
        } else if (type == 2) {
            ontoClassService.removeClassDatatypeProperty(appid, s, p, o, l);
        } else if (type == 3) {
            ontoClassService.removeClassAnnotation(appid, s, p, o, l);
        } else {
            throw new RuntimeException("不支持的类型:" + type);
        }

        return ResponseEntity.ok().build();
    }

    @PostMapping("/prop")
    public ResponseEntity<Void> setProperty(@SessionAttribute("appid") int appid, @RequestBody ClassPropSet data) throws OntoServiceException {
        int type = data.getType();
        String s = data.getCls();
        String p = data.getProp();
        String o = data.getValue();
        String l = data.getLang();

        if (type == 1) {
            ontoClassService.addClassObjectProperty(appid, s, p, o);
        } else if (type == 2) {
            ontoClassService.addClassDatatypeProperty(appid, s, p, o, l);
        } else if (type == 3) {
            ontoClassService.addClassAnnotationProperty(appid, s, p, o, l);
        } else {
            throw new RuntimeException("不支持的类型:" + type);
        }

        return ResponseEntity.ok().build();
    }

    @GetMapping("/props/keys")
    public List<CandidateProp> getCandidatePropsKeys(@SessionAttribute("appid") int appid, @RequestParam("cls") String cls) throws OntoServiceException {
        List<KbPropOption> types = ontoClassService.getClassSupportedPropsKeys(appid, cls);
        return types.stream().map(it -> {
            CandidateProp prop = new CandidateProp(it.getDisplayName(), it.getUri());
            prop.setType(it.getType());
            return prop;
        }).collect(Collectors.toList());
    }

    @GetMapping("/props/values")
    public List<CandidateProp> getCandidatePropsValues(@SessionAttribute("appid") int appid, @RequestParam("cls") String cls, @RequestParam("key") String key)
        throws OntoServiceException {
        log.debug("cls=[{}]", cls);
        log.debug("key=[{}]", key);
        List<KbPropOption> types = ontoClassService.getClassSupportedPropsValues(appid, key);
        return types.stream().map(it -> {
            CandidateProp prop = new CandidateProp(it.getDisplayName(), it.getUri());
            prop.setType(it.getType());
            return prop;
        }).collect(Collectors.toList());
    }

    @GetMapping("/ants/keys")
    public List<CandidateProp> getCandidateAnnotationsKeys(@SessionAttribute("appid") int appid, @RequestParam("cls") String cls)
        throws OntoServiceException {
        List<KbPropOption> types = ontoClassService.getClassSupportedAntsKeys(appid, cls);
        return types.stream().map(it -> {
            CandidateProp prop = new CandidateProp(it.getDisplayName(), it.getUri());
            prop.setType(it.getType());
            return prop;
        }).collect(Collectors.toList());
    }

    @DeleteMapping("/annotation")
    public ResponseEntity<Void> removeAnnotationProperty(@SessionAttribute("appid") int appid, @RequestBody AntDel data) throws OntoServiceException {
        String s = data.getIri();
        String p = data.getKey();
        String o = data.getValue();
        String l = data.getLang();
        ontoClassService.removeClassAnnotation(appid, s, p, o, l);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/annotation")
    public ResponseEntity<Void> setAnnotationProperty(@SessionAttribute("appid") int appid, @RequestBody AntSet data) throws OntoServiceException {
        String s = data.getIri();
        String p = data.getKey();
        String o = data.getValue();
        String l = data.getLang();
        ontoClassService.addClassAnnotationProperty(appid, s, p, o, l);
        return ResponseEntity.ok().build();
    }
}

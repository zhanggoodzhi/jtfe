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
@RequestMapping("/api/framework/prop")
@Slf4j
public class PropertyRestController {

    @Reference
    private OntoPropertyService ontoPropertyService;

    @PostMapping("/profile")
    public PropProfile getProfile(@SessionAttribute("appid") int appid, @RequestParam("uri") String uri) throws OntoServiceException {
        PropProfile profile = ontoPropertyService.getPropertyProfile(appid, uri);
        return profile;
    }

    @GetMapping("/root_props")
    public List<KbRootProp> listOntRootProps(@SessionAttribute("appid") int appid, @RequestParam(value = "type", required = false) int type)
        throws OntoServiceException {
        List<KbRootProp> list = ontoPropertyService.getRootProperties(appid, type);
        return list;
    }

    /**
     * @param appid
     * @param uri   null代表获取标注属性
     * @return
     * @throws OntoServiceException
     */
    @GetMapping("/sub_props")
    public List<OntProp> listOntProps(@SessionAttribute("appid") int appid,
                                      @RequestParam(value = "uri", required = false) String uri) throws OntoServiceException {
        List<KbSubProperty> list = ontoPropertyService.getSubProperties(appid, uri);
        return list.stream().map(it -> {
            String displayName = it.getDisplayName();
            String iri = it.getUri();
            boolean hasSub = it.isHasSub();
            OntProp prop = new OntProp(displayName, iri, hasSub);
            return prop;
        }).collect(Collectors.toList());
    }

    @PostMapping("/create")
    public OntProp createProp(@SessionAttribute("appid") int appid, @RequestBody PropCreate data) throws OntoServiceException {
        String label = data.getLabel();
        String lang = data.getLang();
        int type = data.getType();
        String subPropOf = data.getSubPropOf();
        boolean functional = data.getFunctional();

        KbProperty property;
        if (type == 1) {
            property = new KbObjectProperty(label, lang);
        } else if (type == 2) {
            property = new KbDatatypeProperty(label, lang);
        } else if (type == 3) {
            property = new KbAnnotationProperty(label, lang);
        } else {
            throw new RuntimeException("不支持的类型：" + type);
        }

        property.setSubPropertyOf(subPropOf);
        property.setFunctional(functional);
        KbSubProperty kbSubProp = ontoPropertyService.createProperty(appid, property);

        OntProp ontProp = new OntProp(kbSubProp.getDisplayName(), kbSubProp.getUri(), kbSubProp.isHasSub());
        return ontProp;
    }

    @DeleteMapping
    public OntProp deleteProp(@SessionAttribute("appid") int appid, @RequestParam("iri") String uri)
        throws OntoServiceException {
        KbSubProperty kbSubProp = ontoPropertyService.deleteProperty(appid, uri);
        OntProp ontProp = new OntProp(kbSubProp.getDisplayName(), kbSubProp.getUri(), kbSubProp.isHasSub());
        return ontProp;
    }

    @PutMapping("/sub_prop_of")
    public OntProp updateSubPropOf(@SessionAttribute("appid") int appid, @RequestParam("iri") String uri, @RequestParam("super") String subPropOf)
        throws OntoServiceException {
        KbSubProperty prop = ontoPropertyService.updateSubPropertyOf(appid, uri, subPropOf);
        OntProp ontProp = new OntProp(prop.getDisplayName(), prop.getUri(), prop.isHasSub());
        return ontProp;
    }

    @DeleteMapping("/annotation")
    public ResponseEntity<Void> removeAnnotationProperty(@SessionAttribute("appid") int appid, @RequestBody AntDel data) throws OntoServiceException {
        String uri = data.getIri();
        String key = data.getKey();
        String value = data.getValue();
        String lang = data.getLang();
        ontoPropertyService.removePropertyAnnotation(appid, uri, key, value, lang);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/annotation")
    public ResponseEntity<Void> setAnnotationProperty(@SessionAttribute("appid") int appid, @RequestBody AntSet data) throws OntoServiceException {
        String uri = data.getIri();
        String key = data.getKey();
        String value = data.getValue();
        String lang = data.getLang();
        ontoPropertyService.setPropertyAnnotation(appid, uri, key, value, lang);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/domain")
    public ResponseEntity<Void> addDomain(@SessionAttribute("appid") int appid, @RequestParam("iri") String uri, @RequestParam("domain_iri") String domain)
        throws OntoServiceException {
        ontoPropertyService.addPropertyDomain(appid, uri, domain);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/range")
    public ResponseEntity<Void> addRange(@SessionAttribute("appid") int appid, @RequestParam("iri") String uri, @RequestParam("range_iri") String range)
        throws OntoServiceException {
        ontoPropertyService.addPropertyRange(appid, uri, range);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/domain")
    public ResponseEntity<Void> removeDomain(@SessionAttribute("appid") int appid, @RequestParam("iri") String uri, @RequestParam("domain_iri") String domain)
        throws OntoServiceException {
        ontoPropertyService.deletePropertyDomain(appid, uri, domain);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/range")
    public ResponseEntity<Void> removeRange(@SessionAttribute("appid") int appid, @RequestParam("iri") String uri, @RequestParam("range_iri") String range)
        throws OntoServiceException {
        ontoPropertyService.deletePropertyRange(appid, uri, range);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/functional")
    public ResponseEntity<Void> updateFunctional(@SessionAttribute("appid") int appid, @RequestParam("iri") String uri, @RequestParam("val") int val)
        throws OntoServiceException {
        if (val == 0) {
            ontoPropertyService.setPropertyFunctinal(appid, uri, false);
        } else if (val == 1) {
            ontoPropertyService.setPropertyFunctinal(appid, uri, true);
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/ants/keys")
    public List<CandidateProp> getCandidateAnnotationsKeys(@SessionAttribute("appid") int appid, @RequestParam("prop") String propUri)
        throws OntoServiceException {
        log.debug("prop=[{}]", propUri);
        List<KbPropOption> types = ontoPropertyService.getPropertySupportedAntsKeys(appid, propUri);
        return types.stream().map(it -> {
            CandidateProp prop = new CandidateProp(it.getDisplayName(), it.getUri());
            prop.setType(it.getType());
            return prop;
        }).collect(Collectors.toList());
    }

    @GetMapping("/domains")
    public List<CandidateDomain> getCandidateDomains(@SessionAttribute("appid") int appid, @RequestParam("type") int type, @RequestParam(value = "str", defaultValue = "") String queryStr)
        throws OntoServiceException {
        List<KbPropDomainOrRangeOption> types = ontoPropertyService.getDomains(appid, type, queryStr);
        return types.stream().map(it -> {
            CandidateDomain domain = new CandidateDomain(it.getDisplayName(), it.getUri(), it.getType());
            return domain;
        }).collect(Collectors.toList());
    }

    @GetMapping("/ranges")
    public List<CandidateRange> getCandidateRanges(@SessionAttribute("appid") int appid, @RequestParam("type") int type, @RequestParam(value = "str", defaultValue = "") String queryStr) throws OntoServiceException {
        List<KbPropDomainOrRangeOption> types = ontoPropertyService.getRanges(appid, type, queryStr);
        return types.stream().map(it -> {
            CandidateRange range = new CandidateRange(it.getDisplayName(), it.getUri(), it.getType());
            return range;
        }).collect(Collectors.toList());
    }
}

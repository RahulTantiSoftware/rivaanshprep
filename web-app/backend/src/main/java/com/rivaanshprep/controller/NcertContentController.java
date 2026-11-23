package com.rivaanshprep.controller;

import com.rivaanshprep.service.CloudflareR2Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.InputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RestController
@RequestMapping("/api/v1/content")
public class NcertContentController {

    private static final Logger log = LoggerFactory.getLogger(NcertContentController.class);

    @Autowired(required = false)
    private CloudflareR2Service r2Service;

    @org.springframework.beans.factory.annotation.Value("${cloudflare.r2.base-url:}")
    private String r2BaseUrl;

    private List<String> getChapterDirs() {
        String baseDir = System.getenv("NCERT_BASE_DIR");
        List<String> subjectFolders = List.of(
                "ncert_class10_math/Chapters",
                "ncert_class10_science/Chapters",
                "ncert_class10_social_science/Chapters",
                "ncert_class10_english/Chapters",
                "ncert_class10_hindi/Chapters",
                "ncert_class10_hindi_medium/Chapters",
                "ncert_class11_physics",
                "ncert_class11_chemistry",
                "ncert_class11_math",
                "ncert_class12_physics",
                "ncert_class12_chemistry",
                "ncert_class12_math"
        );

        List<String> resolvedDirs = new ArrayList<>();
        List<String> candidateRoots = new ArrayList<>();
        if (baseDir != null && !baseDir.isBlank()) {
            candidateRoots.add(baseDir);
        }
        candidateRoots.add(".");
        candidateRoots.add("..");
        candidateRoots.add("../..");
        candidateRoots.add("D:\\rivaanshprep");

        for (String root : candidateRoots) {
            for (String sub : subjectFolders) {
                File dir = Paths.get(root, sub).toFile();
                if (dir.exists() && dir.isDirectory()) {
                    String abs = dir.getAbsolutePath();
                    if (!resolvedDirs.contains(abs)) {
                        resolvedDirs.add(abs);
                    }
                }
            }
        }
        return resolvedDirs;
    }

    @GetMapping("/r2/verify")
    public ResponseEntity<Map<String, Object>> verifyR2Connection() {
        Map<String, Object> res = new LinkedHashMap<>();
        boolean configured = r2Service != null && r2Service.isConfigured();
        res.put("r2Configured", configured);
        res.put("bucket", "rivaanshprep");

        if (configured) {
            String testFile = "Chapter_01_Real_Numbers.pdf";
            try (InputStream is = r2Service.fetchPdfStream(testFile)) {
                if (is != null) {
                    byte[] buffer = new byte[1024];
                    int bytesRead = is.read(buffer);
                    res.put("status", "SUCCESS_LINKED");
                    res.put("testSampleFile", testFile);
                    res.put("sampleBytesRead", bytesRead);
                    res.put("verifiedSource", "Cloudflare R2 Object Storage (APAC)");
                    return ResponseEntity.ok(res);
                } else {
                    res.put("status", "FAILED_FILE_NOT_FOUND");
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
                }
            } catch (Exception e) {
                res.put("status", "ERROR");
                res.put("error", e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
            }
        } else {
            res.put("status", "NOT_CONFIGURED");
            return ResponseEntity.badRequest().body(res);
        }
    }

    @GetMapping("/toc")
    public ResponseEntity<Map<String, Object>> getTableOfContents(
            @RequestParam(value = "class", defaultValue = "10") String studentClass,
            @RequestParam(value = "subject", defaultValue = "math") String subject,
            @RequestParam(value = "medium", defaultValue = "english") String medium) {
        return getSubjectToc(subject, studentClass, medium);
    }

    @GetMapping("/toc/{subject}")
    public ResponseEntity<Map<String, Object>> getSubjectToc(
            @PathVariable String subject,
            @RequestParam(value = "class", defaultValue = "10") String studentClass,
            @RequestParam(value = "medium", defaultValue = "english") String medium) {
        String cleanSubject = subject == null ? "math" : subject.toLowerCase().trim();
        boolean isHindiMedium = "hindi".equalsIgnoreCase(medium) || "hi".equalsIgnoreCase(medium);

        // Class 11 Subjects
        if (cleanSubject.endsWith("-11") || "11".equals(studentClass)) {
            if (cleanSubject.startsWith("physics")) {
                return ResponseEntity.ok(Class11And12Catalog.getClass11PhysicsToc(isHindiMedium));
            } else if (cleanSubject.startsWith("chemistry")) {
                return ResponseEntity.ok(Class11And12Catalog.getClass11ChemistryToc(isHindiMedium));
            } else if (cleanSubject.startsWith("math")) {
                return ResponseEntity.ok(Class11And12Catalog.getClass11MathToc(isHindiMedium));
            }
        }

        // Class 12 Subjects
        if (cleanSubject.endsWith("-12") || "12".equals(studentClass)) {
            if (cleanSubject.startsWith("physics")) {
                return ResponseEntity.ok(Class11And12Catalog.getClass12PhysicsToc(isHindiMedium));
            } else if (cleanSubject.startsWith("chemistry")) {
                return ResponseEntity.ok(Class11And12Catalog.getClass12ChemistryToc(isHindiMedium));
            } else if (cleanSubject.startsWith("math")) {
                return ResponseEntity.ok(Class11And12Catalog.getClass12MathToc(isHindiMedium));
            }
        }

        switch (cleanSubject) {
            case "science":
                return ResponseEntity.ok(isHindiMedium ? getScienceHindiToc() : getScienceToc());
            case "social-science":
            case "social_science":
            case "socialscience":
            case "sst":
                return ResponseEntity.ok(isHindiMedium ? getSocialScienceHindiToc() : getSocialScienceToc());
            case "english":
                return ResponseEntity.ok(getEnglishToc());
            case "hindi":
                return ResponseEntity.ok(getHindiToc());
            case "math":
            case "mathematics":
            default:
                return ResponseEntity.ok(isHindiMedium ? getMathHindiToc() : getMathToc());
        }
    }

    @GetMapping("/pdf/{fileName:.+}")
    public ResponseEntity<Resource> getPdfFile(
            @PathVariable String fileName,
            @RequestHeader(value = "X-Rivaansh-Secure-Reader", required = false) String secureReaderHeader,
            @RequestHeader(value = "Sec-Fetch-Dest", required = false) String secFetchDest) {
        return findAndServePdf(fileName, secureReaderHeader, secFetchDest);
    }

    @GetMapping("/pdf/{subject}/{fileName:.+}")
    public ResponseEntity<Resource> getSubjectPdfFile(
            @PathVariable String subject,
            @PathVariable String fileName,
            @RequestHeader(value = "X-Rivaansh-Secure-Reader", required = false) String secureReaderHeader,
            @RequestHeader(value = "Sec-Fetch-Dest", required = false) String secFetchDest) {
        return findAndServePdf(fileName, secureReaderHeader, secFetchDest);
    }

    private ResponseEntity<Resource> findAndServePdf(String fileName, String secureReaderHeader, String secFetchDest) {
        // Enforce anti-download and direct browser URL access restriction:
        // Direct browser address bar navigations or unauthorized fetches lacking our internal app token are blocked.
        if (!"authorized-view-only".equals(secureReaderHeader) || "document".equalsIgnoreCase(secFetchDest)) {
            log.warn("Unauthorized direct PDF download attempt intercepted for file: {}. IP or Client bypassed reader.", fileName);
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .header("X-Security-Reason", "Direct download is restricted. Use RivaanshPrep Reader.")
                    .build();
        }

        try {
            // Sanitize filename to prevent path traversal
            if (fileName == null || fileName.contains("..") || fileName.contains("/") || fileName.contains("\\")) {
                return ResponseEntity.badRequest().build();
            }

            // 1. First check local disk libraries
            File targetFile = null;
            for (String dirPath : getChapterDirs()) {
                Path path = Paths.get(dirPath, fileName).normalize();
                File candidate = path.toFile();
                if (candidate.exists() && candidate.isFile()) {
                    targetFile = candidate;
                    break;
                }
            }

            // 2. If available locally, stream with DRM protection
            if (targetFile != null) {
                Resource resource = new FileSystemResource(targetFile);
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_PDF)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"protected-stream.dat\"")
                        .header(HttpHeaders.CACHE_CONTROL, "no-store, no-cache, must-revalidate, max-age=0")
                        .header(HttpHeaders.PRAGMA, "no-cache")
                        .header(HttpHeaders.EXPIRES, "0")
                        .header("X-Content-Type-Options", "nosniff")
                        .header("X-Frame-Options", "DENY")
                        .header("X-Source-Origin", "local-disk")
                        .body(resource);
            }

            // 3. Fallback to Cloudflare R2 S3 authenticated client
            if (r2Service != null && r2Service.isConfigured()) {
                InputStream r2Stream = r2Service.fetchPdfStream(fileName);
                if (r2Stream != null) {
                    InputStreamResource r2Resource = new InputStreamResource(r2Stream);
                    return ResponseEntity.ok()
                            .contentType(MediaType.APPLICATION_PDF)
                            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"protected-stream.dat\"")
                            .header(HttpHeaders.CACHE_CONTROL, "no-store, no-cache, must-revalidate, max-age=0")
                            .header(HttpHeaders.PRAGMA, "no-cache")
                            .header(HttpHeaders.EXPIRES, "0")
                            .header("X-Content-Type-Options", "nosniff")
                            .header("X-Frame-Options", "DENY")
                            .header("X-Source-Origin", "cloudflare-r2-verified")
                            .body(r2Resource);
                }
            }

            log.warn("Requested PDF file not found across local libraries or Cloudflare R2: {}", fileName);
            return ResponseEntity.notFound().build();

        } catch (Exception e) {
            log.error("Error serving PDF file: {}", fileName, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ==========================================
    // 1. MATHEMATICS TOC (14 Core + 3 Appendices)
    // ==========================================
    private Map<String, Object> getMathToc() {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("subjectId", "math");
        data.put("title", "MATHEMATICS Textbook for Class X");
        data.put("board", "NCERT / CBSE Class 10");
        data.put("code", "Code 041");

        List<Map<String, Object>> categories = List.of(
                createCategory("core", "Core Chapters", "NCERT Mathematics Class 10", "Main curriculum standard & basic chapters", 14),
                createCategory("appendices", "Appendices & Solutions", "Reference & Solutions", "Proofs, mathematical modelling & exercise answers", 3)
        );
        data.put("categories", categories);

        List<Map<String, Object>> chapters = new ArrayList<>();
        chapters.add(createChapter(1, "Real Numbers", "Chapter_01_Real_Numbers.pdf", "jhmh101.pdf", "वास्तविक संख्याएँ (Real Numbers)", "core", "Core Chapters", "NCERT Mathematics", List.of(
                createTopic("1.1", "Introduction"),
                createTopic("1.2", "The Fundamental Theorem of Arithmetic"),
                createTopic("1.3", "Revisiting Irrational Numbers"),
                createTopic("1.4", "Summary")
        )));
        chapters.add(createChapter(2, "Polynomials", "Chapter_02_Polynomials.pdf", "jhmh102.pdf", "बहुपद (Polynomials)", "core", "Core Chapters", "NCERT Mathematics", List.of(
                createTopic("2.1", "Introduction"),
                createTopic("2.2", "Geometrical Meaning of the Zeroes of a Polynomial"),
                createTopic("2.3", "Relationship between Zeroes and Coefficients of a Polynomial"),
                createTopic("2.4", "Summary")
        )));
        chapters.add(createChapter(3, "Pair of Linear Equations in Two Variables", "Chapter_03_Pair_of_Linear_Equations_in_Two_Variables.pdf", "jhmh103.pdf", "दो चर वाले रैखिक समीकरण युग्म (Linear Equations)", "core", "Core Chapters", "NCERT Mathematics", List.of(
                createTopic("3.1", "Introduction"),
                createTopic("3.2", "Graphical Method of Solution of a Pair of Linear Equations"),
                createTopic("3.3", "Algebraic Methods: Substitution & Elimination"),
                createTopic("3.4", "Summary")
        )));
        chapters.add(createChapter(4, "Quadratic Equations", "Chapter_04_Quadratic_Equations.pdf", "jhmh104.pdf", "द्विघात समीकरण (Quadratic Equations)", "core", "Core Chapters", "NCERT Mathematics", List.of(
                createTopic("4.1", "Introduction"),
                createTopic("4.2", "Quadratic Equations & Standard Form"),
                createTopic("4.3", "Solution by Factorisation"),
                createTopic("4.4", "Nature of Roots & Discriminant"),
                createTopic("4.5", "Summary")
        )));
        chapters.add(createChapter(5, "Arithmetic Progressions", "Chapter_05_Arithmetic_Progressions.pdf", "jhmh105.pdf", "समान्तर श्रेढ़ियाँ (Arithmetic Progressions)", "core", "Core Chapters", "NCERT Mathematics", List.of(
                createTopic("5.1", "Introduction to AP"),
                createTopic("5.2", "Arithmetic Progressions"),
                createTopic("5.3", "nth Term of an AP"),
                createTopic("5.4", "Sum of First n Terms of an AP"),
                createTopic("5.5", "Summary")
        )));
        chapters.add(createChapter(6, "Triangles", "Chapter_06_Triangles.pdf", "jhmh106.pdf", "त्रिभुज (Triangles)", "core", "Core Chapters", "NCERT Mathematics", List.of(
                createTopic("6.1", "Introduction"),
                createTopic("6.2", "Similar Figures"),
                createTopic("6.3", "Similarity of Triangles & BPT Theorem"),
                createTopic("6.4", "Criteria for Similarity of Triangles"),
                createTopic("6.5", "Summary")
        )));
        chapters.add(createChapter(7, "Coordinate Geometry", "Chapter_07_Coordinate_Geometry.pdf", "jhmh107.pdf", "निर्देशांक ज्यामिति (Coordinate Geometry)", "core", "Core Chapters", "NCERT Mathematics", List.of(
                createTopic("7.1", "Introduction"),
                createTopic("7.2", "Distance Formula"),
                createTopic("7.3", "Section Formula"),
                createTopic("7.4", "Summary")
        )));
        chapters.add(createChapter(8, "Introduction to Trigonometry", "Chapter_08_Introduction_to_Trigonometry.pdf", "jhmh108.pdf", "त्रिकोणमिति का परिचय (Trigonometry)", "core", "Core Chapters", "NCERT Mathematics", List.of(
                createTopic("8.1", "Introduction"),
                createTopic("8.2", "Trigonometric Ratios (sin, cos, tan, etc.)"),
                createTopic("8.3", "Trigonometric Ratios of Specific Angles (0, 30, 45, 60, 90)"),
                createTopic("8.4", "Trigonometric Identities"),
                createTopic("8.5", "Summary")
        )));
        chapters.add(createChapter(9, "Some Applications of Trigonometry", "Chapter_09_Some_Applications_of_Trigonometry.pdf", "jhmh109.pdf", "त्रिकोणमिति के कुछ अनुप्रयोग (Heights & Distances)", "core", "Core Chapters", "NCERT Mathematics", List.of(
                createTopic("9.1", "Heights and Distances (Line of Sight & Angles)"),
                createTopic("9.2", "Summary")
        )));
        chapters.add(createChapter(10, "Circles", "Chapter_10_Circles.pdf", "jhmh110.pdf", "वृत्त (Circles)", "core", "Core Chapters", "NCERT Mathematics", List.of(
                createTopic("10.1", "Introduction"),
                createTopic("10.2", "Tangent to a Circle"),
                createTopic("10.3", "Number of Tangents from a Point on a Circle"),
                createTopic("10.4", "Summary")
        )));
        chapters.add(createChapter(11, "Areas Related to Circles", "Chapter_11_Areas_Related_to_Circles.pdf", "jhmh111.pdf", "वृत्तों से संबंधित क्षेत्रफल (Areas Related to Circles)", "core", "Core Chapters", "NCERT Mathematics", List.of(
                createTopic("11.1", "Areas of Sector and Segment of a Circle"),
                createTopic("11.2", "Summary")
        )));
        chapters.add(createChapter(12, "Surface Areas and Volumes", "Chapter_12_Surface_Areas_and_Volumes.pdf", "jhmh112.pdf", "पृष्ठीय क्षेत्रफल और आयतन (Surface Areas & Volumes)", "core", "Core Chapters", "NCERT Mathematics", List.of(
                createTopic("12.1", "Introduction"),
                createTopic("12.2", "Surface Area of a Combination of Solids"),
                createTopic("12.3", "Volume of a Combination of Solids"),
                createTopic("12.4", "Summary")
        )));
        chapters.add(createChapter(13, "Statistics", "Chapter_13_Statistics.pdf", "jhmh113.pdf", "सांख्यिकी (Statistics)", "core", "Core Chapters", "NCERT Mathematics", List.of(
                createTopic("13.1", "Mean of Grouped Data"),
                createTopic("13.2", "Mode of Grouped Data"),
                createTopic("13.3", "Median of Grouped Data"),
                createTopic("13.4", "Summary")
        )));
        chapters.add(createChapter(14, "Probability", "Chapter_14_Probability.pdf", "jhmh114.pdf", "प्रायिकता (Probability)", "core", "Core Chapters", "NCERT Mathematics", List.of(
                createTopic("14.1", "Probability — A Theoretical Approach"),
                createTopic("14.2", "Summary")
        )));

        // Appendices & Solutions Sub-Category
        chapters.add(createChapter(15, "Appendix A1", "Proofs in Mathematics", "Appendix_01_Proofs_in_Mathematics.pdf", "jhmh1a1.pdf", "गणित में उपपत्तियाँ (Proofs)", "appendices", "Appendices & Solutions", "Reference & Solutions", List.of(
                createTopic("A1.1", "Introduction to Mathematical Proofs"),
                createTopic("A1.2", "Theorems, Conjectures and Axioms"),
                createTopic("A1.3", "What is a Mathematical Proof?"),
                createTopic("A1.4", "Deductive Reasoning & Counter Examples")
        )));
        chapters.add(createChapter(16, "Appendix A2", "Mathematical Modelling", "Appendix_02_Mathematical_Modelling.pdf", "jhmh1a2.pdf", "गणितीय प्रतिरूपण (Mathematical Modelling)", "appendices", "Appendices & Solutions", "Reference & Solutions", List.of(
                createTopic("A2.1", "Introduction to Mathematical Modelling"),
                createTopic("A2.2", "The Process of Mathematical Modelling"),
                createTopic("A2.3", "Word Problems as Models"),
                createTopic("A2.4", "Limitations of Mathematical Models")
        )));
        chapters.add(createChapter(17, "Solutions", "Answers & Hints for Exercises", "Answers.pdf", "jhmh1an.pdf", "उत्तरमाला / संपूर्ण हल (Answers & Solutions)", "appendices", "Appendices & Solutions", "Reference & Solutions", List.of(
                createTopic("S.1", "Answers for Chapters 1 to 5 (Arithmetic & Algebra)"),
                createTopic("S.2", "Answers for Chapters 6 to 9 (Geometry & Trigonometry)"),
                createTopic("S.3", "Answers for Chapters 10 to 14 (Mensuration, Statistics & Probability)"),
                createTopic("S.4", "Hints and Explanations for Complex Problems")
        )));

        data.put("chapters", chapters);
        return data;
    }

    // ==========================================
    // 2. SCIENCE TOC (16 Chapters across 4 Categories)
    // ==========================================
    private Map<String, Object> getScienceToc() {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("subjectId", "science");
        data.put("title", "SCIENCE Textbook for Class X");
        data.put("board", "NCERT / CBSE Class 10");
        data.put("code", "Code 086");

        List<Map<String, Object>> categories = List.of(
                createCategory("chemistry", "Chemistry", "Chemical Substances — Nature & Behaviour", "Reactions, acids, bases, salts, metals, carbon & periodic trends", 5),
                createCategory("biology", "Biology", "World of Living", "Life processes, control & coordination, reproduction & heredity", 4),
                createCategory("physics", "Physics", "Natural Phenomena & Effects of Current", "Light optics, human eye, electricity & magnetic effects", 4),
                createCategory("environment", "Natural Resources", "Environment & Ecology", "Sources of energy, ecosystem balance & conservation", 3)
        );
        data.put("categories", categories);

        List<Map<String, Object>> chapters = new ArrayList<>();
        // Chemistry (Ch 1 - 5)
        chapters.add(createChapter(1, "Chemical Reactions and Equations", "jesc101.pdf", "jhsc101.pdf", "रासायनिक अभिक्रियाएं एवं समीकरण", "chemistry", "Chemistry", "Chemical Substances", List.of(
                createTopic("1.1", "Chemical Equations"),
                createTopic("1.2", "Types of Chemical Reactions"),
                createTopic("1.3", "Corrosion and Rancidity in Everyday Life")
        )));
        chapters.add(createChapter(2, "Acids, Bases and Salts", "jesc102.pdf", "jhsc102.pdf", "अम्ल, क्षारक एवं लवण", "chemistry", "Chemistry", "Chemical Substances", List.of(
                createTopic("2.1", "Chemical Properties of Acids & Bases"),
                createTopic("2.2", "Common Ions in Acids and Bases"),
                createTopic("2.3", "pH Scale & Universal Indicators"),
                createTopic("2.4", "Salts: Bleaching Powder, Baking Soda, Plaster of Paris")
        )));
        chapters.add(createChapter(3, "Metals and Non-metals", "jesc103.pdf", "jhsc103.pdf", "धातु एवं अधातु", "chemistry", "Chemistry", "Chemical Substances", List.of(
                createTopic("3.1", "Physical Properties of Metals and Non-metals"),
                createTopic("3.2", "Chemical Properties & Reactivity Series"),
                createTopic("3.3", "Ionic Compounds Formation & Properties"),
                createTopic("3.4", "Extraction of Metals & Metallurgy")
        )));
        chapters.add(createChapter(4, "Carbon and its Compounds", "jesc104.pdf", "jhsc104.pdf", "कार्बन एवं उसके यौगिक", "chemistry", "Chemistry", "Chemical Substances", List.of(
                createTopic("4.1", "Covalent Bonding in Carbon"),
                createTopic("4.2", "Versatile Nature & Homologous Series"),
                createTopic("4.3", "Nomenclature & Chemical Properties"),
                createTopic("4.4", "Ethanol, Ethanoic Acid, Soaps & Detergents")
        )));
        chapters.add(createChapter(5, "Periodic Classification of Elements", "jesc105.pdf", "jhsc105.pdf", "तत्वों का आवर्त वर्गीकरण", "chemistry", "Chemistry", "Chemical Substances", List.of(
                createTopic("5.1", "Early Classifications: Dobereiner & Newlands"),
                createTopic("5.2", "Mendeleev's Periodic Table"),
                createTopic("5.3", "Modern Periodic Table & Periodic Trends")
        )));

        // Biology (Ch 6 - 9)
        chapters.add(createChapter(6, "Life Processes", "jesc106.pdf", "jhsc106.pdf", "जैव प्रक्रम", "biology", "Biology", "World of Living", List.of(
                createTopic("6.1", "Autotrophic & Heterotrophic Nutrition"),
                createTopic("6.2", "Respiration in Organisms"),
                createTopic("6.3", "Circulation & Transportation in Animals and Plants"),
                createTopic("6.4", "Excretion in Human Beings and Plants")
        )));
        chapters.add(createChapter(7, "Control and Coordination", "jesc107.pdf", "jhsc107.pdf", "नियंत्रण एवं समन्वय", "biology", "Biology", "World of Living", List.of(
                createTopic("7.1", "Nervous System, Neurons & Reflex Arc"),
                createTopic("7.2", "Human Brain & Reflex Action"),
                createTopic("7.3", "Coordination in Plants & Plant Hormones"),
                createTopic("7.4", "Hormones in Animals & Endocrine Glands")
        )));
        chapters.add(createChapter(8, "How do Organisms Reproduce?", "jesc108.pdf", "jhsc108.pdf", "जीव जनन कैसे करते हैं", "biology", "Biology", "World of Living", List.of(
                createTopic("8.1", "Asexual Reproduction: Fission, Budding, Spores"),
                createTopic("8.2", "Sexual Reproduction in Flowering Plants"),
                createTopic("8.3", "Reproduction in Human Beings"),
                createTopic("8.4", "Reproductive Health & Contraception")
        )));
        chapters.add(createChapter(9, "Heredity and Evolution", "jesc109.pdf", "jhsc109.pdf", "आनुवंशिकता एवं जैव विकास", "biology", "Biology", "World of Living", List.of(
                createTopic("9.1", "Accumulation of Variation during Reproduction"),
                createTopic("9.2", "Heredity & Mendel's Laws of Inheritance"),
                createTopic("9.3", "Sex Determination in Humans"),
                createTopic("9.4", "Basic Concepts of Evolution and Speciation")
        )));

        // Physics (Ch 10 - 13)
        chapters.add(createChapter(10, "Light — Reflection and Refraction", "jesc110.pdf", "jhsc110.pdf", "प्रकाश — परावर्तन तथा अपवर्तन", "physics", "Physics", "Natural Phenomena & Current", List.of(
                createTopic("10.1", "Reflection of Light & Spherical Mirrors"),
                createTopic("10.2", "Mirror Formula and Magnification"),
                createTopic("10.3", "Refraction of Light & Snell's Law"),
                createTopic("10.4", "Refraction by Spherical Lenses & Lens Formula"),
                createTopic("10.5", "Power of a Lens")
        )));
        chapters.add(createChapter(11, "The Human Eye and the Colourful World", "jesc111.pdf", "jhsc111.pdf", "मानव नेत्र तथा रंगबिरंगा संसार", "physics", "Physics", "Natural Phenomena & Current", List.of(
                createTopic("11.1", "Structure of Human Eye & Power of Accommodation"),
                createTopic("11.2", "Defects of Vision: Myopia, Hypermetropia, Presbyopia"),
                createTopic("11.3", "Refraction through a Glass Prism & Dispersion"),
                createTopic("11.4", "Atmospheric Refraction & Twinkling of Stars"),
                createTopic("11.5", "Scattering of Light & Tyndall Effect")
        )));
        chapters.add(createChapter(12, "Electricity", "jesc112.pdf", "jhsc112.pdf", "विद्युत", "physics", "Physics", "Natural Phenomena & Current", List.of(
                createTopic("12.1", "Electric Current and Circuit"),
                createTopic("12.2", "Electric Potential and Potential Difference"),
                createTopic("12.3", "Ohm's Law, Resistance & Factors"),
                createTopic("12.4", "Resistors in Series and Parallel"),
                createTopic("12.5", "Heating Effect of Electric Current & Joule's Law"),
                createTopic("12.6", "Electric Power & Commercial Units")
        )));
        chapters.add(createChapter(13, "Magnetic Effects of Electric Current", "jesc113.pdf", "jhsc113.pdf", "विद्युत धारा के चुंबकीय प्रभाव", "physics", "Physics", "Natural Phenomena & Current", List.of(
                createTopic("13.1", "Magnetic Field and Field Lines"),
                createTopic("13.2", "Right-Hand Thumb Rule & Solenoid Field"),
                createTopic("13.3", "Force on a Current-Carrying Conductor & Fleming's Left-Hand Rule"),
                createTopic("13.4", "Electric Motor & Electromagnetic Induction"),
                createTopic("13.5", "Domestic Electric Circuits & Safety (Earthing, Fuse)")
        )));

        // Natural Resources & Ecology (Ch 14 - 16)
        chapters.add(createChapter(14, "Sources of Energy", "jesc114.pdf", "jhsc114.pdf", "ऊर्जा के स्रोत", "environment", "Natural Resources", "Environment & Ecology", List.of(
                createTopic("14.1", "Conventional Sources of Energy: Fossil Fuels, Thermal & Hydro"),
                createTopic("14.2", "Biomass and Wind Energy"),
                createTopic("14.3", "Non-Conventional Sources: Solar, Sea, Geothermal, Nuclear"),
                createTopic("14.4", "Environmental Consequences & Sustainability")
        )));
        chapters.add(createChapter(15, "Our Environment", "jesc115.pdf", "jhsc115.pdf", "हमारा पर्यावरण", "environment", "Natural Resources", "Environment & Ecology", List.of(
                createTopic("15.1", "Eco-system & Its Components: Food Chains and Webs"),
                createTopic("15.2", "Trophic Levels & 10% Energy Flow Law"),
                createTopic("15.3", "Ozone Layer Depletion & Waste Management (Biodegradable/Non-biodegradable)")
        )));
        chapters.add(createChapter(16, "Sustainable Management of Natural Resources", "jesc116.pdf", "jhsc116.pdf", "प्राकृतिक संसाधनों का संपोषित प्रबंधन", "environment", "Natural Resources", "Environment & Ecology", List.of(
                createTopic("16.1", "The 5 R's to Save Environment"),
                createTopic("16.2", "Forests, Wildlife & Stakeholders"),
                createTopic("16.3", "Water Harvesting, Dams & Conservation"),
                createTopic("16.4", "Sustainable Coal and Petroleum Usage")
        )));

        data.put("chapters", chapters);
        return data;
    }

    // ==========================================
    // 3. SOCIAL SCIENCE TOC (25 Chapters across 4 Units)
    // ==========================================
    private Map<String, Object> getSocialScienceToc() {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("subjectId", "social-science");
        data.put("title", "SOCIAL SCIENCE (History, Geography, Civics, Economics)");
        data.put("board", "NCERT / CBSE Class 10");
        data.put("code", "Code 087");

        List<Map<String, Object>> categories = List.of(
                createCategory("history", "History", "India and the Contemporary World - II", "Rise of nationalism, global world, industrialisation & print culture", 5),
                createCategory("geography", "Geography", "Contemporary India - II", "Resources, forests, water, agriculture, minerals & manufacturing", 7),
                createCategory("civics", "Political Science", "Democratic Politics - II", "Power sharing, federalism, gender, religion, caste & political parties", 8),
                createCategory("economics", "Economics", "Understanding Economic Development", "Development indicators, sectors of Indian economy, money, credit & globalisation", 5)
        );
        data.put("categories", categories);

        List<Map<String, Object>> chapters = new ArrayList<>();

        // Unit 1: History (India and the Contemporary World - II)
        chapters.add(createChapter(1, "The Rise of Nationalism in Europe", "jess301.pdf", "jhss301.pdf", "यूरोप में राष्ट्रवाद का उदय", "history", "History", "India and the Contemporary World - II", List.of(
                createTopic("1.1", "The French Revolution and the Idea of the Nation"),
                createTopic("1.2", "The Making of Nationalism in Europe"),
                createTopic("1.3", "The Age of Revolutions: 1830-1848"),
                createTopic("1.4", "The Making of Germany and Italy")
        )));
        chapters.add(createChapter(2, "Nationalism in India", "jess302.pdf", "jhss302.pdf", "भारत में राष्ट्रवाद", "history", "History", "India and the Contemporary World - II", List.of(
                createTopic("2.1", "The First World War, Khilafat and Non-Cooperation"),
                createTopic("2.2", "Differing Strands within the Movement"),
                createTopic("2.3", "Towards Civil Disobedience & Salt March"),
                createTopic("2.4", "The Sense of Collective Belonging")
        )));
        chapters.add(createChapter(3, "The Making of a Global World", "jess303.pdf", "jhss303.pdf", "भूमंडलीकृत विश्व का बनना", "history", "History", "India and the Contemporary World - II", List.of(
                createTopic("3.1", "The Pre-modern World & Silk Routes"),
                createTopic("3.2", "The Nineteenth Century (1815-1914)"),
                createTopic("3.3", "The Inter-war Economy & Great Depression"),
                createTopic("3.4", "Rebuilding a World Economy: Post-war Era")
        )));
        chapters.add(createChapter(4, "The Age of Industrialisation", "jess304.pdf", "jhss304.pdf", "औद्योगीकरण का युग", "history", "History", "India and the Contemporary World - II", List.of(
                createTopic("4.1", "Before the Industrial Revolution"),
                createTopic("4.2", "Hand Labour and Steam Power"),
                createTopic("4.3", "Industrialisation in the Colonies"),
                createTopic("4.4", "Factories Come Up & Market for Goods")
        )));
        chapters.add(createChapter(5, "Print Culture and the Modern World", "jess305.pdf", "jhss305.pdf", "मुद्रण संस्कृति और आधुनिक दुनिया", "history", "History", "India and the Contemporary World - II", List.of(
                createTopic("5.1", "The First Printed Books in East Asia"),
                createTopic("5.2", "Print Comes to Europe & Gutenberg Press"),
                createTopic("5.3", "The Print Revolution and Its Impact"),
                createTopic("5.4", "India and the World of Print")
        )));

        // Unit 2: Geography (Contemporary India - II)
        chapters.add(createChapter(6, "Resources and Development", "jess101.pdf", "jhss101.pdf", "संसाधन एवं विकास", "geography", "Geography", "Contemporary India - II", List.of(
                createTopic("6.1", "Types of Resources & Development of Resources"),
                createTopic("6.2", "Resource Planning in India"),
                createTopic("6.3", "Land Resources & Land Degradation"),
                createTopic("6.4", "Soil as a Resource & Soil Classification")
        )));
        chapters.add(createChapter(7, "Forest and Wildlife Resources", "jess102.pdf", "jhss102.pdf", "वन एवं वन्य जीव संसाधन", "geography", "Geography", "Contemporary India - II", List.of(
                createTopic("7.1", "Flora and Fauna in India"),
                createTopic("7.2", "Conservation of Forest and Wildlife in India"),
                createTopic("7.3", "Types and Distribution of Forest and Wildlife Resources"),
                createTopic("7.4", "Community and Conservation (Chipko, JFM)")
        )));
        chapters.add(createChapter(8, "Water Resources", "jess103.pdf", "jhss103.pdf", "जल संसाधन", "geography", "Geography", "Contemporary India - II", List.of(
                createTopic("8.1", "Water Scarcity and The Need for Conservation"),
                createTopic("8.2", "Multi-Purpose River Projects and Integrated Water Management"),
                createTopic("8.3", "Rainwater Harvesting Techniques")
        )));
        chapters.add(createChapter(9, "Agriculture", "jess104.pdf", "jhss104.pdf", "कृषि", "geography", "Geography", "Contemporary India - II", List.of(
                createTopic("9.1", "Types of Farming: Primitive, Intensive & Commercial"),
                createTopic("9.2", "Cropping Pattern (Rabi, Kharif, Zaid)"),
                createTopic("9.3", "Major Food and Non-food Crops"),
                createTopic("9.4", "Technological and Institutional Reforms")
        )));
        chapters.add(createChapter(10, "Minerals and Energy Resources", "jess105.pdf", "jhss105.pdf", "खनिज तथा ऊर्जा संसाधन", "geography", "Geography", "Contemporary India - II", List.of(
                createTopic("10.1", "Mode of Occurrence of Minerals"),
                createTopic("10.2", "Ferrous and Non-Ferrous Minerals"),
                createTopic("10.3", "Non-Metallic and Rock Minerals"),
                createTopic("10.4", "Conventional and Non-Conventional Sources of Energy")
        )));
        chapters.add(createChapter(11, "Manufacturing Industries", "jess106.pdf", "jhss106.pdf", "विनिर्माण उद्योग", "geography", "Geography", "Contemporary India - II", List.of(
                createTopic("11.1", "Importance of Manufacturing & Contribution to Economy"),
                createTopic("11.2", "Industrial Location & Classification of Industries"),
                createTopic("11.3", "Agro-based and Mineral-based Industries"),
                createTopic("11.4", "Industrial Pollution and Environmental Degradation")
        )));
        chapters.add(createChapter(12, "Life Lines of National Economy", "jess107.pdf", "jhss107.pdf", "राष्ट्रीय अर्थव्यवस्था की जीवन रेखाएँ", "geography", "Geography", "Contemporary India - II", List.of(
                createTopic("12.1", "Transport: Roadways, Railways, Pipelines, Waterways, Airways"),
                createTopic("12.2", "Communication Services: Post and Telecom"),
                createTopic("12.3", "International Trade & Tourism as a Trade")
        )));

        // Unit 3: Democratic Politics - II (Political Science)
        chapters.add(createChapter(13, "Power Sharing", "jess401.pdf", "jhss401.pdf", "सत्ता की साझेदारी", "civics", "Political Science", "Democratic Politics - II", List.of(
                createTopic("13.1", "Case Studies: Belgium and Sri Lanka"),
                createTopic("13.2", "Why is Power Sharing Desirable?"),
                createTopic("13.3", "Forms of Power Sharing in Modern Democracies")
        )));
        chapters.add(createChapter(14, "Federalism", "jess402.pdf", "jhss402.pdf", "संघवाद", "civics", "Political Science", "Democratic Politics - II", List.of(
                createTopic("14.1", "What is Federalism? Key Features"),
                createTopic("14.2", "What Makes India a Federal Country? (Three Lists)"),
                createTopic("14.3", "How is Federalism Practised? Linguistic States"),
                createTopic("14.4", "Decentralisation in India (Panchayati Raj)")
        )));
        chapters.add(createChapter(15, "Democracy and Diversity", "jess403.pdf", "jhss403.pdf", "लोकतंत्र और विविधता", "civics", "Political Science", "Democratic Politics - II", List.of(
                createTopic("15.1", "A Story from Mexico Olympics"),
                createTopic("15.2", "Differences, Similarities, Divisions"),
                createTopic("15.3", "Politics of Social Divisions")
        )));
        chapters.add(createChapter(16, "Gender, Religion and Caste", "jess404.pdf", "jhss404.pdf", "जाति, धर्म और लैंगिक मसले", "civics", "Political Science", "Democratic Politics - II", List.of(
                createTopic("16.1", "Gender and Politics: Public/Private Division"),
                createTopic("16.2", "Religion, Communalism and Politics"),
                createTopic("16.3", "Caste and Politics & Caste Inequalities")
        )));
        chapters.add(createChapter(17, "Popular Struggles and Movements", "jess405.pdf", "jhss405.pdf", "जन-संघर्ष और आंदोलन", "civics", "Political Science", "Democratic Politics - II", List.of(
                createTopic("17.1", "Movement for Democracy in Nepal and Bolivia"),
                createTopic("17.2", "Mobilisation and Organisations"),
                createTopic("17.3", "Pressure Groups and Movements")
        )));
        chapters.add(createChapter(18, "Political Parties", "jess406.pdf", "jhss406.pdf", "राजनीतिक दल", "civics", "Political Science", "Democratic Politics - II", List.of(
                createTopic("18.1", "Why do We Need Political Parties? Functions"),
                createTopic("18.2", "How Many Parties Should We Have?"),
                createTopic("18.3", "National Parties & State Parties in India"),
                createTopic("18.4", "Challenges to Political Parties & Reforms")
        )));
        chapters.add(createChapter(19, "Outcomes of Democracy", "jess407.pdf", "jhss407.pdf", "लोकतंत्र के परिणाम", "civics", "Political Science", "Democratic Politics - II", List.of(
                createTopic("19.1", "How do We Assess Democracy's Outcomes?"),
                createTopic("19.2", "Accountable, Responsive and Legitimate Government"),
                createTopic("19.3", "Economic Growth, Reduction of Inequality and Poverty"),
                createTopic("19.4", "Accommodation of Social Diversity & Dignity of Citizens")
        )));
        chapters.add(createChapter(20, "Challenges to Democracy", "jess408.pdf", "jhss408.pdf", "लोकतंत्र की चुनौतियाँ", "civics", "Political Science", "Democratic Politics - II", List.of(
                createTopic("20.1", "Foundational Challenge & Challenge of Expansion"),
                createTopic("20.2", "Deepening of Democracy"),
                createTopic("20.3", "Political Reforms & Redefining Democracy")
        )));

        // Unit 4: Economics (Understanding Economic Development)
        chapters.add(createChapter(21, "Development", "jess201.pdf", "jhss201.pdf", "विकास", "economics", "Economics", "Understanding Economic Development", List.of(
                createTopic("21.1", "What Development Promises — Different People, Different Goals"),
                createTopic("21.2", "Income and Other Goals & National Development"),
                createTopic("21.3", "How to Compare Different Countries or States? (HDI, Per Capita)"),
                createTopic("21.4", "Sustainability of Development")
        )));
        chapters.add(createChapter(22, "Sectors of the Indian Economy", "jess202.pdf", "jhss202.pdf", "भारतीय अर्थव्यवस्था के क्षेत्रक", "economics", "Economics", "Understanding Economic Development", List.of(
                createTopic("22.1", "Sectors of Economic Activities: Primary, Secondary, Tertiary"),
                createTopic("22.2", "Comparing the Three Sectors & Historical Changes"),
                createTopic("22.3", "Where are Most of the People Employed?"),
                createTopic("22.4", "Division of Sectors: Organised vs Unorganised, Public vs Private")
        )));
        chapters.add(createChapter(23, "Money and Credit", "jess203.pdf", "jhss203.pdf", "मुद्रा और साख", "economics", "Economics", "Understanding Economic Development", List.of(
                createTopic("23.1", "Money as a Medium of Exchange & Modern Forms"),
                createTopic("23.2", "Loan Activities of Banks & Two Different Credit Situations"),
                createTopic("23.3", "Terms of Credit"),
                createTopic("23.4", "Formal Sector Credit in India & Self-Help Groups (SHGs)")
        )));
        chapters.add(createChapter(24, "Globalisation and the Indian Economy", "jess204.pdf", "jhss204.pdf", "वैश्वीकरण और भारतीय अर्थव्यवस्था", "economics", "Economics", "Understanding Economic Development", List.of(
                createTopic("24.1", "Production across Countries & Multinational Corporations (MNCs)"),
                createTopic("24.2", "Foreign Trade and Integration of Markets"),
                createTopic("24.3", "What is Globalisation? Factors Enabling Globalisation (IT, WTO)"),
                createTopic("24.4", "Impact of Globalisation in India & The Struggle for a Fair Globalisation")
        )));
        chapters.add(createChapter(25, "Consumer Rights", "jess205.pdf", "jhss205.pdf", "उपभोक्ता अधिकार", "economics", "Economics", "Understanding Economic Development", List.of(
                createTopic("25.1", "The Consumer in the Market Place"),
                createTopic("25.2", "Consumer Movement & COPRA 1986"),
                createTopic("25.3", "Safety is Everyone's Right & Consumer Rights"),
                createTopic("25.4", "Taking the Consumer Movement Forward")
        )));

        data.put("chapters", chapters);
        return data;
    }

    // ==========================================
    // 4. ENGLISH TOC (21 Chapters across 2 Books)
    // ==========================================
    private Map<String, Object> getEnglishToc() {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("subjectId", "english");
        data.put("title", "ENGLISH (First Flight & Footprints without Feet)");
        data.put("board", "NCERT / CBSE Class 10");
        data.put("code", "Code 184");

        List<Map<String, Object>> categories = List.of(
                createCategory("first-flight", "First Flight", "Main Literature Textbook", "Core literature prose & poetry selections", 11),
                createCategory("footprints", "Footprints without Feet", "Supplementary Reader", "Captivating stories, mysteries and short fiction", 10)
        );
        data.put("categories", categories);

        List<Map<String, Object>> chapters = new ArrayList<>();

        // Part 1: First Flight
        chapters.add(createChapter(1, "A Letter to God & Dust of Snow / Fire and Ice", "jeff101.pdf", "first-flight", "First Flight", "First Flight (Main Textbook)", List.of(
                createTopic("1.1", "Prose: A Letter to God by G.L. Fuentes"),
                createTopic("1.2", "Poem: Dust of Snow by Robert Frost"),
                createTopic("1.3", "Poem: Fire and Ice by Robert Frost")
        )));
        chapters.add(createChapter(2, "Nelson Mandela: Long Walk to Freedom & A Tiger in the Zoo", "jeff102.pdf", "first-flight", "First Flight", "First Flight (Main Textbook)", List.of(
                createTopic("2.1", "Prose: Nelson Mandela: Long Walk to Freedom"),
                createTopic("2.2", "Poem: A Tiger in the Zoo by Leslie Norris")
        )));
        chapters.add(createChapter(3, "Two Stories about Flying & How to Tell Wild Animals", "jeff103.pdf", "first-flight", "First Flight", "First Flight (Main Textbook)", List.of(
                createTopic("3.1", "Part I: His First Flight by Liam O’Flaherty"),
                createTopic("3.2", "Part II: Black Aeroplane by Frederick Forsyth"),
                createTopic("3.3", "Poem: How to Tell Wild Animals by Carolyn Wells"),
                createTopic("3.4", "Poem: The Ball Poem by John Berryman")
        )));
        chapters.add(createChapter(4, "From the Diary of Anne Frank & Amanda!", "jeff104.pdf", "first-flight", "First Flight", "First Flight (Main Textbook)", List.of(
                createTopic("4.1", "Prose: From the Diary of Anne Frank"),
                createTopic("4.2", "Poem: Amanda! by Robin Klein")
        )));
        chapters.add(createChapter(5, "The Hundred Dresses - I", "jeff105.pdf", "first-flight", "First Flight", "First Flight (Main Textbook)", List.of(
                createTopic("5.1", "Prose: Wanda Petronski and Room Thirteen"),
                createTopic("5.2", "Character Analysis: Peggy and Maddie")
        )));
        chapters.add(createChapter(6, "The Hundred Dresses - II & Animals", "jeff106.pdf", "first-flight", "First Flight", "First Flight (Main Textbook)", List.of(
                createTopic("6.1", "Prose: A Letter from Mr. Petronski"),
                createTopic("6.2", "Poem: Animals by Walt Whitman")
        )));
        chapters.add(createChapter(7, "Glimpses of India & The Trees", "jeff107.pdf", "first-flight", "First Flight", "First Flight (Main Textbook)", List.of(
                createTopic("7.1", "Part I: A Baker from Goa by Lucio Rodrigues"),
                createTopic("7.2", "Part II: Coorg by Lokesh Abrol"),
                createTopic("7.3", "Part III: Tea from Assam by Arup Kumar Dutta"),
                createTopic("7.4", "Poem: The Trees by Adrienne Rich")
        )));
        chapters.add(createChapter(8, "Mijbil the Otter & Fog", "jeff108.pdf", "first-flight", "First Flight", "First Flight (Main Textbook)", List.of(
                createTopic("8.1", "Prose: Mijbil the Otter by Gavin Maxwell"),
                createTopic("8.2", "Poem: Fog by Carl Sandburg")
        )));
        chapters.add(createChapter(9, "Madam Rides the Bus & The Tale of Custard the Dragon", "jeff109.pdf", "first-flight", "First Flight", "First Flight (Main Textbook)", List.of(
                createTopic("9.1", "Prose: Madam Rides the Bus by Vallikkannan"),
                createTopic("9.2", "Poem: The Tale of Custard the Dragon by Ogden Nash")
        )));
        chapters.add(createChapter(10, "The Sermon at Benares & For Anne Gregory", "jeff110.pdf", "first-flight", "First Flight", "First Flight (Main Textbook)", List.of(
                createTopic("10.1", "Prose: The Sermon at Benares (Kisa Gotami)"),
                createTopic("10.2", "Poem: For Anne Gregory by William Butler Yeats")
        )));
        chapters.add(createChapter(11, "The Proposal (Play)", "jeff111.pdf", "first-flight", "First Flight", "First Flight (Main Textbook)", List.of(
                createTopic("11.1", "One-Act Play by Anton Chekhov"),
                createTopic("11.2", "Characters: Lomov, Chubukov and Natalya")
        )));

        // Part 2: Footprints without Feet
        chapters.add(createChapter(12, "A Triumph of Surgery", "jefp101.pdf", "footprints", "Footprints without Feet", "Footprints without Feet (Supplementary)", List.of(
                createTopic("12.1", "Story: Tricki the Dog and Mrs. Pumphrey"),
                createTopic("12.2", "Veterinary Care by Dr. James Herriot")
        )));
        chapters.add(createChapter(13, "The Thief's Story", "jefp102.pdf", "footprints", "Footprints without Feet", "Footprints without Feet (Supplementary)", List.of(
                createTopic("13.1", "Story: Hari Singh and Anil by Ruskin Bond"),
                createTopic("13.2", "Themes of Trust, Education and Redemption")
        )));
        chapters.add(createChapter(14, "The Midnight Visitor", "jefp103.pdf", "footprints", "Footprints without Feet", "Footprints without Feet (Supplementary)", List.of(
                createTopic("14.1", "Story: Ausable the Secret Agent by Robert Arthur"),
                createTopic("14.2", "Encounter with Max and the Imaginary Balcony")
        )));
        chapters.add(createChapter(15, "A Question of Trust", "jefp104.pdf", "footprints", "Footprints without Feet", "Footprints without Feet (Supplementary)", List.of(
                createTopic("15.1", "Story: Horace Danby and Rare Books by Victor Canning"),
                createTopic("15.2", "The Lady in Red and Honor Among Thieves")
        )));
        chapters.add(createChapter(16, "Footprints without Feet", "jefp105.pdf", "footprints", "Footprints without Feet", "Footprints without Feet (Supplementary)", List.of(
                createTopic("16.1", "Story: Griffin the Invisible Scientist by H.G. Wells"),
                createTopic("16.2", "Adventures in London and the Village of Iping")
        )));
        chapters.add(createChapter(17, "The Making of a Scientist", "jefp106.pdf", "footprints", "Footprints without Feet", "Footprints without Feet (Supplementary)", List.of(
                createTopic("17.1", "Biography: Richard Ebright and Monarch Butterflies"),
                createTopic("17.2", "Scientific Method and Curiosity by Robert W. Peterson")
        )));
        chapters.add(createChapter(18, "The Necklace", "jefp107.pdf", "footprints", "Footprints without Feet", "Footprints without Feet (Supplementary)", List.of(
                createTopic("18.1", "Story: Mathilde Loisel by Guy de Maupassant"),
                createTopic("18.2", "Pride, Vanity and the Irony of the Borrowed Jewels")
        )));
        chapters.add(createChapter(19, "The Hack Driver", "jefp108.pdf", "footprints", "Footprints without Feet", "Footprints without Feet (Supplementary)", List.of(
                createTopic("19.1", "Story: Serving Summons on Oliver Lutkins by Sinclair Lewis"),
                createTopic("19.2", "Bill Magnuson's Clever Disguise")
        )));
        chapters.add(createChapter(20, "Bholi", "jefp109.pdf", "footprints", "Footprints without Feet", "Footprints without Feet (Supplementary)", List.of(
                createTopic("20.1", "Story: Sulekha's Transformation by K.A. Abbas"),
                createTopic("20.2", "Overcoming Stigma, Dowry Refusal and Empowerment")
        )));
        chapters.add(createChapter(21, "The Book that Saved the Earth", "jefp110.pdf", "footprints", "Footprints without Feet", "Footprints without Feet (Supplementary)", List.of(
                createTopic("21.1", "Play: Martian Invasion and Mother Goose by Claire Boiko"),
                createTopic("21.2", "Think-Tank, Noodle and the Library of Earth")
        )));

        data.put("chapters", chapters);
        return data;
    }

    // ==========================================
    // 5. HINDI TOC (22 Chapters across 2 Books)
    // ==========================================
    private Map<String, Object> getHindiToc() {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("subjectId", "hindi");
        data.put("title", "HINDI (Kshitij & Kritika - Course A / B)");
        data.put("board", "NCERT / CBSE Class 10");
        data.put("code", "Code 002");

        List<Map<String, Object>> categories = List.of(
                createCategory("kshitij", "Kshitij (क्षितिज भाग-२)", "Course A / B Main Reader", "Kavya Khand (काव्य खंड) & Gadya Khand (गद्य खंड)", 17),
                createCategory("kritika", "Kritika (कृतिका भाग-२)", "Supplementary Reader", "Purak Pathyapustak (पूरक पाठ्यपुस्तक)", 5)
        );
        data.put("categories", categories);

        List<Map<String, Object>> chapters = new ArrayList<>();

        // Part 1: Kshitij (Ch 1 - 17)
        chapters.add(createChapter(1, "Surdas ke Pad", "jhks101.pdf", "kshitij", "Kshitij (क्षितिज भाग-२)", "Kshitij Part 2", List.of(
                createTopic("1.1", "B भ्रमरगीत से चयनित पद"),
                createTopic("1.2", "Gopiyon ka Uddhav ko Ulahana & Bhakti Bhav")
        )));
        chapters.add(createChapter(2, "Tulsidas — Ram-Lakshman-Parshuram Samvad", "jhks102.pdf", "kshitij", "Kshitij (क्षितिज भाग-२)", "Kshitij Part 2", List.of(
                createTopic("2.1", "Dhanush Bhang ke baad Parshuram Krodh"),
                createTopic("2.2", "Lakshman ka Vyangya aur Ram ki Vinamrata")
        )));
        chapters.add(createChapter(3, "Dev — Savaiya aur Kavitt", "jhks103.pdf", "kshitij", "Kshitij (क्षितिज भाग-२)", "Kshitij Part 2", List.of(
                createTopic("3.1", "Paiyanin Nupur Manju Bajai (Shri Krishna Roop)"),
                createTopic("3.2", "Basant Rutu Varnan")
        )));
        chapters.add(createChapter(4, "Jaishankar Prasad — Aatmakathya", "jhks104.pdf", "kshitij", "Kshitij (क्षितिज भाग-२)", "Kshitij Part 2", List.of(
                createTopic("4.1", "Chhayavadi Kavya Shaili"),
                createTopic("4.2", "Jeevan ke Dukh aur Madhu Yadon ka Smaran")
        )));
        chapters.add(createChapter(5, "Suryakant Tripathi 'Nirala' — Utsah / At Nahi Rahi Hai", "jhks105.pdf", "kshitij", "Kshitij (क्षितिज भाग-२)", "Kshitij Part 2", List.of(
                createTopic("5.1", "Badal Garjo — Kranti aur Chetna ka Sandesh"),
                createTopic("5.2", "Phagun ki Prakritik Sundarta")
        )));
        chapters.add(createChapter(6, "Nagarjun — Yeh Danturit Muskan / Fasal", "jhks106.pdf", "kshitij", "Kshitij (क्षितिज भाग-२)", "Kshitij Part 2", List.of(
                createTopic("6.1", "Shishu ki Muskan ka Prabhav"),
                createTopic("6.2", "Kisan aur Prakriti ki Mehnat ka Phal — Fasal")
        )));
        chapters.add(createChapter(7, "Girija Kumar Mathur — Chhaya Mat Chhuna", "jhks107.pdf", "kshitij", "Kshitij (क्षितिज भाग-२)", "Kshitij Part 2", List.of(
                createTopic("7.1", "Ateet ki Yaadein aur Vartaman ka Sangharsh"),
                createTopic("7.2", "Bhavishya Nirman ka Sandesh")
        )));
        chapters.add(createChapter(8, "Rituraj — Kanyadan", "jhks108.pdf", "kshitij", "Kshitij (क्षितिज भाग-२)", "Kshitij Part 2", List.of(
                createTopic("8.1", "Maa ki Seekh aur Samajik Yetharth"),
                createTopic("8.2", "Komalta ke peeche Shaktishali Hona")
        )));
        chapters.add(createChapter(9, "Manglesh Dabral — Sangatkar", "jhks109.pdf", "kshitij", "Kshitij (क्षितिज भाग-२)", "Kshitij Part 2", List.of(
                createTopic("9.1", "Mukhya Gayak ke sath Sahayak Kalakar ki Bhoomika"),
                createTopic("9.2", "Tyag aur Samajik Maryada")
        )));
        chapters.add(createChapter(10, "Swayam Prakash — Netaji Ka Chashma", "jhks110.pdf", "kshitij", "Kshitij (क्षितिज भाग-२)", "Kshitij Part 2", List.of(
                createTopic("10.1", "Haldar Sahab aur Captain Chashmewala"),
                createTopic("10.2", "Deshbhakti ki Sachhi Bhavna")
        )));
        chapters.add(createChapter(11, "Ramvriksh Benipuri — Balgobin Bhagat", "jhks111.pdf", "kshitij", "Kshitij (क्षितिज भाग-२)", "Kshitij Part 2", List.of(
                createTopic("11.1", "Sanyasi Vyaktitva aur Kabir Panth"),
                createTopic("11.2", "Kalam ka Jadugar aur Samajik Kureeti Virodh")
        )));
        chapters.add(createChapter(12, "Yashpal — Lakhnavi Andaz", "jhks112.pdf", "kshitij", "Kshitij (क्षितिज भाग-२)", "Kshitij Part 2", List.of(
                createTopic("12.1", "Samanti Varg ki Dikhavati Shaili"),
                createTopic("12.2", "Kheer khane ka Nawab Sahab ka Andaz")
        )));
        chapters.add(createChapter(13, "Sarveshwar Dayal Saxena — Manviya Karuna Ki Divya Chamak", "jhks113.pdf", "kshitij", "Kshitij (क्षितिज भाग-२)", "Kshitij Part 2", List.of(
                createTopic("13.1", "Father Camille Bulcke ka Vyaktitva"),
                createTopic("13.2", "Hindi Bhasha ke prati Aagaadh Prem")
        )));
        chapters.add(createChapter(14, "Manu Bhandari — Ek Kahani Yeh Bhi", "jhks114.pdf", "kshitij", "Kshitij (क्षितिज भाग-२)", "Kshitij Part 2", List.of(
                createTopic("14.1", "Lekhika ka Bachpan aur Parivarik Vatavaran"),
                createTopic("14.2", "Azaadi Andolan aur Mahila Jagran")
        )));
        chapters.add(createChapter(15, "Mahavir Prasad Dwivedi — Stree Shiksha ke Virodhi Kutarkon ka Khandan", "jhks115.pdf", "kshitij", "Kshitij (क्षितिज भाग-२)", "Kshitij Part 2", List.of(
                createTopic("15.1", "Pracheen Kaal mein Stree Shiksha ke Praman"),
                createTopic("15.2", "Samajik Unnati ke liye Mahila Shiksha")
        )));
        chapters.add(createChapter(16, "Yatindra Mishra — Naubatkhane Mein Ibadat", "jhks116.pdf", "kshitij", "Kshitij (क्षितिज भाग-२)", "Kshitij Part 2", List.of(
                createTopic("16.1", "Ustad Bismillah Khan ka Jeevan aur Shehnai"),
                createTopic("16.2", "Kashi ki Sanskritik Virasat aur Sangeet Sadhana")
        )));
        chapters.add(createChapter(17, "Bhadant Anand Kausalyayan — Sanskriti", "jhks117.pdf", "kshitij", "Kshitij (क्षितिज भाग-२)", "Kshitij Part 2", List.of(
                createTopic("17.1", "Sabhyata aur Sanskriti mein Antar"),
                createTopic("17.2", "Manav Kalyan ki Bhavna")
        )));

        // Part 2: Kritika (Ch 18 - 22)
        chapters.add(createChapter(18, "Mata Ka Anchal", "jhkr101.pdf", "kritika", "Kritika (कृतिका भाग-२)", "Kritika Part 2", List.of(
                createTopic("18.1", "Bholanath ka Bachpan aur Pitaji ka Dular"),
                createTopic("18.2", "Maa ke Aanchal mein Sharan aur Mamta")
        )));
        chapters.add(createChapter(19, "George Pancham Ki Naak", "jhkr102.pdf", "kritika", "Kritika (कृतिका भाग-२)", "Kritika Part 2", List.of(
                createTopic("19.1", "Rani Elizabeth ke Aagman ki Taiyari"),
                createTopic("19.2", "Ghulami Mansikta par Teekha Vyangya")
        )));
        chapters.add(createChapter(20, "Sana-Sana Hath Jodi", "jhkr103.pdf", "kritika", "Kritika (कृतिका भाग-२)", "Kritika Part 2", List.of(
                createTopic("20.1", "Sikkim ki Rajdhani Gangtok ki Yatra"),
                createTopic("20.2", "Himalaya ki Sundarta aur Mazdooron ka Sangharsh")
        )));
        chapters.add(createChapter(21, "Ehi Thaiyan Jhulni Herani Ho Rama", "jhkr104.pdf", "kritika", "Kritika (कृतिका भाग-२)", "Kritika Part 2", List.of(
                createTopic("21.1", "Dullari aur Tunnu ki Kahani"),
                createTopic("21.2", "Kajri Gayan aur Desh Prem")
        )));
        chapters.add(createChapter(22, "Main Kyon Likhta Hoon?", "jhkr105.pdf", "kritika", "Kritika (कृतिका भाग-२)", "Kritika Part 2", List.of(
                createTopic("22.1", "Agyeya ji ka Rachnatmak Anubhav"),
                createTopic("22.2", "Hiroshima Parmanu Visphot ki Trasadi")
        )));

        data.put("chapters", chapters);
        return data;
    }


    // ==========================================
    // 6. HINDI MEDIUM: MATHEMATICS (गणित)
    // ==========================================
    private Map<String, Object> getMathHindiToc() {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("subjectId", "math");
        data.put("medium", "hindi");
        data.put("title", "गणित — कक्षा 10 के लिए पाठ्यपुस्तक (Mathematics)");
        data.put("board", "NCERT / CBSE Class 10 (हिंदी माध्यम)");
        data.put("code", "Code 041 (Hindi)");

        List<Map<String, Object>> categories = List.of(
                createCategory("core", "मुख्य अध्याय (Core Chapters)", "गणित कक्षा 10", "मानक एवं बेसिक पाठ्यक्रम (1 से 14 अध्याय)", 14),
                createCategory("appendices", "परिशिष्ट और उत्तरमाला", "संदर्भ सामग्री एवं हल", "गणितीय उपपत्तियाँ, प्रतिरूपण एवं अभ्यास हल", 3)
        );
        data.put("categories", categories);

        List<Map<String, Object>> chapters = new ArrayList<>();
        chapters.add(createChapter(1, "वास्तविक संख्याएँ (Real Numbers)", "jhmh101.pdf", "core", "मुख्य अध्याय", "गणित कक्षा 10", List.of(
                createTopic("1.1", "भूमिका (Introduction)"),
                createTopic("1.2", "अंकगणित की आधारभूत प्रमेय"),
                createTopic("1.3", "अपरिमेय संख्याओं का पुनर्भ्रमण"),
                createTopic("1.4", "सारांश")
        )));
        chapters.add(createChapter(2, "बहुपद (Polynomials)", "jhmh102.pdf", "core", "मुख्य अध्याय", "गणित कक्षा 10", List.of(
                createTopic("2.1", "भूमिका"),
                createTopic("2.2", "किसी बहुपद के शून्यकों का ज्यामितीय अर्थ"),
                createTopic("2.3", "शून्यकों और गुणांकों में संबंध"),
                createTopic("2.4", "सारांश")
        )));
        chapters.add(createChapter(3, "दो चर वाले रैखिक समीकरण युग्म (Linear Equations)", "jhmh103.pdf", "core", "मुख्य अध्याय", "गणित कक्षा 10", List.of(
                createTopic("3.1", "भूमिका"),
                createTopic("3.2", "रैखिक समीकरण युग्म का ग्राफ़ीय विधि से हल"),
                createTopic("3.3", "बीजगणितीय विधियाँ: प्रतिस्थापन व विलोपन"),
                createTopic("3.4", "सारांश")
        )));
        chapters.add(createChapter(4, "द्विघात समीकरण (Quadratic Equations)", "jhmh104.pdf", "core", "मुख्य अध्याय", "गणित कक्षा 10", List.of(
                createTopic("4.1", "भूमिका"),
                createTopic("4.2", "द्विघात समीकरण एवं मानक रूप"),
                createTopic("4.3", "गुणनखंडों द्वारा द्विघात समीकरण का हल"),
                createTopic("4.4", "मूलों की प्रकृति एवं विविक्तकर"),
                createTopic("4.5", "सारांश")
        )));
        chapters.add(createChapter(5, "समांतर श्रेढियाँ (Arithmetic Progressions)", "jhmh105.pdf", "core", "मुख्य अध्याय", "गणित कक्षा 10", List.of(
                createTopic("5.1", "भूमिका"),
                createTopic("5.2", "समांतर श्रेढियाँ"),
                createTopic("5.3", "AP का n-वाँ पद"),
                createTopic("5.4", "AP के प्रथम n पदों का योग"),
                createTopic("5.5", "सारांश")
        )));
        chapters.add(createChapter(6, "त्रिभुज (Triangles)", "jhmh106.pdf", "core", "मुख्य अध्याय", "गणित कक्षा 10", List.of(
                createTopic("6.1", "भूमिका"),
                createTopic("6.2", "समरूप आकृतियाँ"),
                createTopic("6.3", "त्रिभुजों की समरूपता (BPT प्रमेय)"),
                createTopic("6.4", "त्रिभुजों की समरूपता के लिए कसौटियाँ"),
                createTopic("6.5", "सारांश")
        )));
        chapters.add(createChapter(7, "निर्देशांक ज्यामिति (Coordinate Geometry)", "jhmh107.pdf", "core", "मुख्य अध्याय", "गणित कक्षा 10", List.of(
                createTopic("7.1", "भूमिका"),
                createTopic("7.2", "दूरी सूत्र (Distance Formula)"),
                createTopic("7.3", "विभाजन सूत्र (Section Formula)"),
                createTopic("7.4", "सारांश")
        )));
        chapters.add(createChapter(8, "त्रिकोणमिति का परिचय (Trigonometry)", "jhmh108.pdf", "core", "मुख्य अध्याय", "गणित कक्षा 10", List.of(
                createTopic("8.1", "भूमिका"),
                createTopic("8.2", "त्रिकोणमितीय अनुपात"),
                createTopic("8.3", "विशिष्ट कोणों के त्रिकोणमितीय अनुपात (0, 30, 45, 60, 90)"),
                createTopic("8.4", "त्रिकोणमितीय सर्वसमिकाएँ"),
                createTopic("8.5", "सारांश")
        )));
        chapters.add(createChapter(9, "त्रिकोणमिति के कुछ अनुप्रयोग (Heights & Distances)", "jhmh109.pdf", "core", "मुख्य अध्याय", "गणित कक्षा 10", List.of(
                createTopic("9.1", "ऊँचाइयाँ और दूरियाँ (दृष्टि रेखा, उन्नयन व अवनमन कोण)"),
                createTopic("9.2", "सारांश")
        )));
        chapters.add(createChapter(10, "वृत्त (Circles)", "jhmh110.pdf", "core", "मुख्य अध्याय", "गणित कक्षा 10", List.of(
                createTopic("10.1", "भूमिका"),
                createTopic("10.2", "वृत्त की स्पर्श रेखा"),
                createTopic("10.3", "एक बिंदु से वृत्त पर स्पर्श रेखाओं की संख्या"),
                createTopic("10.4", "सारांश")
        )));
        chapters.add(createChapter(11, "वृत्तों से संबंधित क्षेत्रफल (Areas Related to Circles)", "jhmh111.pdf", "core", "मुख्य अध्याय", "गणित कक्षा 10", List.of(
                createTopic("11.1", "त्रिज्यखंड और वृत्तखंड के क्षेत्रफल"),
                createTopic("11.2", "सारांश")
        )));
        chapters.add(createChapter(12, "पृष्ठीय क्षेत्रफल और आयतन (Surface Areas & Volumes)", "jhmh112.pdf", "core", "मुख्य अध्याय", "गणित कक्षा 10", List.of(
                createTopic("12.1", "भूमिका"),
                createTopic("12.2", "ठोसों के संयोजन का पृष्ठीय क्षेत्रफल"),
                createTopic("12.3", "ठोसों के संयोजन का आयतन"),
                createTopic("12.4", "सारांश")
        )));
        chapters.add(createChapter(13, "सांख्यिकी (Statistics)", "jhmh113.pdf", "core", "मुख्य अध्याय", "गणित कक्षा 10", List.of(
                createTopic("13.1", "वर्गीकृत आँकड़ों का माध्य"),
                createTopic("13.2", "वर्गीकृत आँकड़ों का बहुलक"),
                createTopic("13.3", "वर्गीकृत आँकड़ों का माध्यक"),
                createTopic("13.4", "सारांश")
        )));
        chapters.add(createChapter(14, "प्रायिकता (Probability)", "jhmh114.pdf", "core", "मुख्य अध्याय", "गणित कक्षा 10", List.of(
                createTopic("14.1", "प्रायिकता — एक सैद्धांतिक दृष्टिकोण"),
                createTopic("14.2", "सारांश")
        )));

        // परिशिष्ट और उत्तरमाला
        chapters.add(createChapter(15, "परिशिष्ट A1", "गणित में उपपत्तियाँ (Proofs in Mathematics)", "jhmh1a1.pdf", "appendices", "परिशिष्ट और उत्तरमाला", "संदर्भ सामग्री", List.of(
                createTopic("A1.1", "गणितीय उपपत्तियों की भूमिका"),
                createTopic("A1.2", "प्रमेय, अनुमान एवं अभिगृहीत"),
                createTopic("A1.3", "निगमनात्मक तर्क और प्रति-उदाहरण")
        )));
        chapters.add(createChapter(16, "परिशिष्ट A2", "गणितीय प्रतिरूपण (Mathematical Modelling)", "jhmh1a2.pdf", "appendices", "परिशिष्ट और उत्तरमाला", "संदर्भ सामग्री", List.of(
                createTopic("A2.1", "गणितीय प्रतिरूपण की भूमिका"),
                createTopic("A2.2", "प्रतिरूपण प्रक्रम"),
                createTopic("A2.3", "इबारती प्रश्न प्रतिरूप के रूप में")
        )));
        chapters.add(createChapter(17, "उत्तरमाला", "उत्तरमाला एवं अभ्यास संकेत (Answers & Hints)", "jhmh1an.pdf", "appendices", "परिशिष्ट और उत्तरमाला", "अभ्यास हल", List.of(
                createTopic("S.1", "अध्याय 1 से 5 के उत्तर"),
                createTopic("S.2", "अध्याय 6 से 9 के उत्तर"),
                createTopic("S.3", "अध्याय 10 से 14 के उत्तर")
        )));

        data.put("chapters", chapters);
        return data;
    }

    // ==========================================
    // 7. HINDI MEDIUM: SCIENCE (विज्ञान)
    // ==========================================
    private Map<String, Object> getScienceHindiToc() {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("subjectId", "science");
        data.put("medium", "hindi");
        data.put("title", "विज्ञान — कक्षा 10 के लिए पाठ्यपुस्तक (Science)");
        data.put("board", "NCERT / CBSE Class 10 (हिंदी माध्यम)");
        data.put("code", "Code 086 (Hindi)");

        List<Map<String, Object>> categories = List.of(
                createCategory("chemistry", "रसायन विज्ञान (Chemistry)", "रासायनिक पदार्थ — प्रकृति एवं व्यवहार", "अभिक्रियाएं, अम्ल, क्षार, लवण, धातु, कार्बन एवं आवर्त वर्गीकरण", 5),
                createCategory("biology", "जीव विज्ञान (Biology)", "सजीव जगत", "जैव प्रक्रम, नियंत्रण, जनन एवं आनुवंशिकता", 4),
                createCategory("physics", "भौतिक विज्ञान (Physics)", "प्राकृतिक घटनाएं एवं विद्युत प्रभाव", "प्रकाश, मानव नेत्र, विद्युत एवं चुंबकीय प्रभाव", 4),
                createCategory("environment", "प्राकृतिक संसाधन एवं पर्यावरण", "पर्यावरण संतुलन", "ऊर्जा स्रोत, पारितंत्र एवं संपोषित प्रबंधन", 3)
        );
        data.put("categories", categories);

        List<Map<String, Object>> chapters = new ArrayList<>();
        // रसायन विज्ञान (1 से 5)
        chapters.add(createChapter(1, "रासायनिक अभिक्रियाएं एवं समीकरण", "jhsc101.pdf", "chemistry", "रसायन विज्ञान", "सजीव जगत", List.of(
                createTopic("1.1", "रासायनिक समीकरण"),
                createTopic("1.2", "रासायनिक अभिक्रियाओं के प्रकार"),
                createTopic("1.3", "दैनिक जीवन में उपचयन अभिक्रियाओं के प्रभाव (संक्षारण एवं विकृतगंधिता)")
        )));
        chapters.add(createChapter(2, "अम्ल, क्षारक एवं लवण", "jhsc102.pdf", "chemistry", "रसायन विज्ञान", "रासायनिक पदार्थ", List.of(
                createTopic("2.1", "अम्ल एवं क्षारकों के रासायनिक गुणधर्म"),
                createTopic("2.2", "सभी अम्लों एवं क्षारकों में क्या समानताएं हैं?"),
                createTopic("2.3", "pH पैमाना एवं सार्वत्रिक सूचक"),
                createTopic("2.4", "लवण: विरंजक चूर्ण, बेकिंग सोडा, प्लास्टर ऑफ पेरिस")
        )));
        chapters.add(createChapter(3, "धातु एवं अधातु", "jhsc103.pdf", "chemistry", "रसायन विज्ञान", "रासायनिक पदार्थ", List.of(
                createTopic("3.1", "भौतिक एवं रासायनिक गुणधर्म"),
                createTopic("3.2", "सक्रियता श्रेणी"),
                createTopic("3.3", "आयनिक यौगिकों का निर्माण"),
                createTopic("3.4", "धातुओं की प्राप्ति एवं निष्कर्षण")
        )));
        chapters.add(createChapter(4, "कार्बन एवं उसके यौगिक", "jhsc104.pdf", "chemistry", "रसायन विज्ञान", "रासायनिक पदार्थ", List.of(
                createTopic("4.1", "कार्बन में सहसंयोजी आबंधन"),
                createTopic("4.2", "कार्बन की सर्वतोमुखी प्रकृति एवं समजातीय श्रेणी"),
                createTopic("4.3", "रासायनिक गुणधर्म एवं नामपद्धति"),
                createTopic("4.4", "एथेनॉल, एथेनॉइक अम्ल, साबुन एवं अपमार्जक")
        )));
        chapters.add(createChapter(5, "तत्वों का आवर्त वर्गीकरण", "jhsc105.pdf", "chemistry", "रसायन विज्ञान", "रासायनिक पदार्थ", List.of(
                createTopic("5.1", "डोबेराइनर एवं न्यूलैंड्स का अष्टक सिद्धांत"),
                createTopic("5.2", "मेंडेलीफ की आवर्त सारणी"),
                createTopic("5.3", "आधुनिक आवर्त सारणी एवं आवर्त प्रवृत्तियाँ")
        )));

        // जीव विज्ञान (6 से 9)
        chapters.add(createChapter(6, "जैव प्रक्रम", "jhsc106.pdf", "biology", "जीव विज्ञान", "सजीव जगत", List.of(
                createTopic("6.1", "पोषण: स्वपोषी एवं विषमपोषी"),
                createTopic("6.2", "श्वसन"),
                createTopic("6.3", "वहन: मानव एवं पादपों में परिसंचरण"),
                createTopic("6.4", "उत्सर्जन")
        )));
        chapters.add(createChapter(7, "नियंत्रण एवं समन्वय", "jhsc107.pdf", "biology", "जीव विज्ञान", "सजीव जगत", List.of(
                createTopic("7.1", "मानव तंत्रिका तंत्र एवं न्यूरॉन"),
                createTopic("7.2", "प्रतिवर्ती क्रिया एवं मानव मस्तिष्क"),
                createTopic("7.3", "पादपों में समन्वय एवं पादप हार्मोन"),
                createTopic("7.4", "जंतुओं में हार्मोन एवं अंतःस्रावी ग्रंथियाँ")
        )));
        chapters.add(createChapter(8, "जीव जनन कैसे करते हैं?", "jhsc108.pdf", "biology", "जीव विज्ञान", "सजीव जगत", List.of(
                createTopic("8.1", "अलैंगिक जनन: विखंडन, मुकुलन, बीजाणु"),
                createTopic("8.2", "पुष्पी पौधों में लैंगिक जनन"),
                createTopic("8.3", "मानव में लैंगिक जनन"),
                createTopic("8.4", "जनन स्वास्थ्य एवं गर्भनिरोधक विधियाँ")
        )));
        chapters.add(createChapter(9, "आनुवंशिकता एवं जैव विकास", "jhsc109.pdf", "biology", "जीव विज्ञान", "सजीव जगत", List.of(
                createTopic("9.1", "जनन के दौरान विभिन्नताओं का संचयन"),
                createTopic("9.2", "आनुवंशिकता एवं मेंडल के नियम"),
                createTopic("9.3", "मानव में लिंग निर्धारण"),
                createTopic("9.4", "विकास एवं जाति-उद्भव")
        )));

        // भौतिक विज्ञान (10 से 13)
        chapters.add(createChapter(10, "प्रकाश – परावर्तन तथा अपवर्तन", "jhsc110.pdf", "physics", "भौतिक विज्ञान", "प्राकृतिक घटनाएं", List.of(
                createTopic("10.1", "प्रकाश का परावर्तन एवं गोलीय दर्पण"),
                createTopic("10.2", "दर्पण सूत्र एवं आवर्धन"),
                createTopic("10.3", "प्रकाश का अपवर्तन एवं स्नेल का नियम"),
                createTopic("10.4", "गोलीय लेंसों द्वारा अपवर्तन एवं लेंस सूत्र"),
                createTopic("10.5", "लेंस की क्षमता")
        )));
        chapters.add(createChapter(11, "मानव नेत्र तथा रंगबिरंगा संसार", "jhsc111.pdf", "physics", "भौतिक विज्ञान", "प्राकृतिक घटनाएं", List.of(
                createTopic("11.1", "मानव नेत्र की संरचना एवं समंजन क्षमता"),
                createTopic("11.2", "दृष्टि दोष: निकट, दीर्घ एवं जरा-दूरदृष्टिता"),
                createTopic("11.3", "प्रिज्म से अपवर्तन एवं वर्ण-विक्षेपण"),
                createTopic("11.4", "वायुमंडलीय अपवर्तन"),
                createTopic("11.5", "प्रकाश का प्रकीर्णन एवं टिंडल प्रभाव")
        )));
        chapters.add(createChapter(12, "विद्युत", "jhsc112.pdf", "physics", "भौतिक विज्ञान", "विद्युत प्रभाव", List.of(
                createTopic("12.1", "विद्युत धारा और परिपथ"),
                createTopic("12.2", "विद्युत विभव और विभवांतर"),
                createTopic("12.3", "ओम का नियम एवं प्रतिरोध"),
                createTopic("12.4", "श्रेणीक्रम एवं पार्श्वक्रम में प्रतिरोधक"),
                createTopic("12.5", "विद्युत धारा का तापीय प्रभाव (जूल का नियम)"),
                createTopic("12.6", "विद्युत शक्ति")
        )));
        chapters.add(createChapter(13, "विद्युत धारा के चुंबकीय प्रभाव", "jhsc113.pdf", "physics", "भौतिक विज्ञान", "विद्युत प्रभाव", List.of(
                createTopic("13.1", "चुंबकीय क्षेत्र और क्षेत्र रेखाएं"),
                createTopic("13.2", "दाहिने हाथ का अँगूठा नियम एवं परिनालिका"),
                createTopic("13.3", "फ्लेमिंग का वाम-हस्त नियम"),
                createTopic("13.4", "विद्युत मोटर एवं वैद्युतचुंबकीय प्रेरण"),
                createTopic("13.5", "घरेलू विद्युत परिपथ एवं सुरक्षा (भू-संपर्क, फ्यूज)")
        )));

        // प्राकृतिक संसाधन (14 से 16)
        chapters.add(createChapter(14, "ऊर्जा के स्रोत", "jhsc114.pdf", "environment", "प्राकृतिक संसाधन", "पर्यावरण", List.of(
                createTopic("14.1", "ऊर्जा के पारंपरिक स्रोत: जीवाश्मी ईंधन, जल"),
                createTopic("14.2", "जैव-मात्रा एवं पवन ऊर्जा"),
                createTopic("14.3", "गैर-पारंपरिक स्रोत: सौर, समुद्र, भूतापीय, नाभिकीय"),
                createTopic("14.4", "पर्यावरण-विषयक परिणाम")
        )));
        chapters.add(createChapter(15, "हमारा पर्यावरण", "jhsc115.pdf", "environment", "प्राकृतिक संसाधन", "पर्यावरण", List.of(
                createTopic("15.1", "पारितंत्र एवं इसके घटक: खाद्य श्रृंखला एवं जाल"),
                createTopic("15.2", "पोषी स्तर एवं 10% ऊर्जा प्रवाह नियम"),
                createTopic("15.3", "ओजोन परत का क्षय एवं कचरा प्रबंधन")
        )));
        chapters.add(createChapter(16, "प्राकृतिक संसाधनों का संपोषित प्रबंधन", "jhsc116.pdf", "environment", "प्राकृतिक संसाधन", "पर्यावरण", List.of(
                createTopic("16.1", "पर्यावरण संरक्षण के 5 'R' नियम"),
                createTopic("16.2", "वन एवं वन्य जीव"),
                createTopic("16.3", "जल संग्रहण एवं बाँध"),
                createTopic("16.4", "कोयला एवं पेट्रोलियम का सतत उपयोग")
        )));

        data.put("chapters", chapters);
        return data;
    }

    // ==========================================
    // 8. HINDI MEDIUM: SOCIAL SCIENCE (सामाजिक विज्ञान)
    // ==========================================
    private Map<String, Object> getSocialScienceHindiToc() {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("subjectId", "social-science");
        data.put("medium", "hindi");
        data.put("title", "सामाजिक विज्ञान (इतिहास, भूगोल, राजनीति, अर्थशास्त्र)");
        data.put("board", "NCERT / CBSE Class 10 (हिंदी माध्यम)");
        data.put("code", "Code 087 (Hindi)");

        List<Map<String, Object>> categories = List.of(
                createCategory("history", "इतिहास (History)", "भारत और समकालीन विश्व - II", "राष्ट्रवाद का उदय, वैश्विक दुनिया, औद्योगीकरण एवं मुद्रण संस्कृति", 5),
                createCategory("geography", "भूगोल (Geography)", "समकालीन भारत - II", "संसाधन, वन, जल, कृषि, खनिज, विनिर्माण एवं अर्थव्यवस्था", 7),
                createCategory("civics", "राजनीति विज्ञान (Civics)", "लोकतांत्रिक राजनीति - II", "सत्ता की साझेदारी, संघवाद, विविधता, जाति एवं राजनीतिक दल", 8),
                createCategory("economics", "अर्थशास्त्र (Economics)", "आर्थिक विकास की समझ", "विकास, भारतीय अर्थव्यवस्था के क्षेत्रक, मुद्रा एवं वैश्वीकरण", 5)
        );
        data.put("categories", categories);

        List<Map<String, Object>> chapters = new ArrayList<>();

        // Unit 1: इतिहास (भारत और समकालीन विश्व - II)
        chapters.add(createChapter(1, "यूरोप में राष्ट्रवाद का उदय", "jhss301.pdf", "history", "इतिहास", "भारत और समकालीन विश्व - II", List.of(
                createTopic("1.1", "फ्रांसीसी क्रांति और राष्ट्र का विचार"),
                createTopic("1.2", "यूरोप में राष्ट्रवाद का निर्माण"),
                createTopic("1.3", "क्रांतियों का युग: 1830-1848"),
                createTopic("1.4", "जर्मनी और इटली का निर्माण")
        )));
        chapters.add(createChapter(2, "भारत में राष्ट्रवाद", "jhss302.pdf", "history", "इतिहास", "भारत और समकालीन विश्व - II", List.of(
                createTopic("2.1", "प्रथम विश्व युद्ध, ख़िलाफ़त और असहयोग"),
                createTopic("2.2", "आंदोलन के भीतर अलग-अलग धाराएँ"),
                createTopic("2.3", "सविनय अवज्ञा की ओर एवं नमक यात्रा"),
                createTopic("2.4", "सामूहिक अपनेपन का भाव")
        )));
        chapters.add(createChapter(3, "भूमंडलीकृत विश्व का बनना", "jhss303.pdf", "history", "इतिहास", "भारत और समकालीन विश्व - II", List.of(
                createTopic("3.1", "आधुनिक काल से पहले: रेशम मार्ग"),
                createTopic("3.2", "उन्नीसवीं शताब्दी (1815-1914)"),
                createTopic("3.3", "महामंदी एवं युद्धकालीन अर्थव्यवस्था"),
                createTopic("3.4", "विश्व अर्थव्यवस्था का पुनर्निर्माण: युद्धोत्तर काल")
        )));
        chapters.add(createChapter(4, "औद्योगीकरण का युग", "jhss304.pdf", "history", "इतिहास", "भारत और समकालीन विश्व - II", List.of(
                createTopic("4.1", "औद्योगिक क्रांति से पहले"),
                createTopic("4.2", "हाथ का श्रम और वाष्प शक्ति"),
                createTopic("4.3", "उपनिवेशों में औद्योगिकीकरण"),
                createTopic("4.4", "कारखानों का आना एवं वस्तुओं का बाज़ार")
        )));
        chapters.add(createChapter(5, "मुद्रण संस्कृति और आधुनिक दुनिया", "jhss305.pdf", "history", "इतिहास", "भारत और समकालीन विश्व - II", List.of(
                createTopic("5.1", "शुरुआती छपी पुस्तकें: पूर्वी एशिया"),
                createTopic("5.2", "यूरोप में प्रिंट का आगमन एवं गुटेनबर्ग प्रेस"),
                createTopic("5.3", "प्रिंट क्रांति और उसका असर"),
                createTopic("5.4", "भारत और प्रिंट की दुनिया")
        )));

        // Unit 2: भूगोल (समकालीन भारत - II)
        chapters.add(createChapter(6, "संसाधन एवं विकास", "jhss101.pdf", "geography", "भूगोल", "समकालीन भारत - II", List.of(
                createTopic("6.1", "संसाधनों के प्रकार एवं नियोजन"),
                createTopic("6.2", "भू-संसाधन एवं भू-उपयोग प्रारूप"),
                createTopic("6.3", "मृदा संसाधन एवं मृदा का वर्गीकरण"),
                createTopic("6.4", "मृदा अपरदन और संरक्षण")
        )));
        chapters.add(createChapter(7, "वन एवं वन्य जीव संसाधन", "jhss102.pdf", "geography", "भूगोल", "समकालीन भारत - II", List.of(
                createTopic("7.1", "भारत में वनस्पतिजात और प्राणिजात"),
                createTopic("7.2", "वन और वन्य जीवन का संरक्षण"),
                createTopic("7.3", "समुदाय और वन संरक्षण (चिपको आंदोलन)")
        )));
        chapters.add(createChapter(8, "जल संसाधन", "jhss103.pdf", "geography", "भूगोल", "समकालीन भारत - II", List.of(
                createTopic("8.1", "जल दुर्लभता और जल संरक्षण की आवश्यकता"),
                createTopic("8.2", "बहुउद्देशीय नदी परियोजनाएं"),
                createTopic("8.3", "वर्षा जल संग्रहण तकनीक")
        )));
        chapters.add(createChapter(9, "कृषि", "jhss104.pdf", "geography", "भूगोल", "समकालीन भारत - II", List.of(
                createTopic("9.1", "कृषि के प्रकार: प्रारंभिक, गहन व वाणिज्यिक"),
                createTopic("9.2", "शस्य प्रारूप (रबी, खरीफ, जायद)"),
                createTopic("9.3", "मुख्य फसलें: खाद्यान्न एवं नकदी फसलें"),
                createTopic("9.4", "संस्थागत एवं तकनीकी सुधार")
        )));
        chapters.add(createChapter(10, "खनिज तथा ऊर्जा संसाधन", "jhss105.pdf", "geography", "भूगोल", "समकालीन भारत - II", List.of(
                createTopic("10.1", "खनिज क्या हैं? खनिजों के प्रकार"),
                createTopic("10.2", "लौह एवं अलौह खनिज"),
                createTopic("10.3", "ऊर्जा संसाधन: परंपरागत एवं गैर-परंपरागत")
        )));
        chapters.add(createChapter(11, "विनिर्माण उद्योग", "jhss106.pdf", "geography", "भूगोल", "समकालीन भारत - II", List.of(
                createTopic("11.1", "विनिर्माण का महत्व एवं अर्थव्यवस्था में योगदान"),
                createTopic("11.2", "उद्योगों की स्थिति एवं वर्गीकरण"),
                createTopic("11.3", "कृषि-आधारित एवं खनिज-आधारित उद्योग"),
                createTopic("11.4", "औद्योगिक प्रदूषण तथा पर्यावरण निम्नीकरण")
        )));
        chapters.add(createChapter(12, "राष्ट्रीय अर्थव्यवस्था की जीवन रेखाएं", "jhss107.pdf", "geography", "भूगोल", "समकालीन भारत - II", List.of(
                createTopic("12.1", "परिवहन: सड़क, रेल, पाइपलाइन, जल व वायु"),
                createTopic("12.2", "संचार सेवाएँ एवं डाक"),
                createTopic("12.3", "अंतर्राष्ट्रीय व्यापार एवं पर्यटन")
        )));

        // Unit 3: राजनीति विज्ञान (लोकतांत्रिक राजनीति - II)
        chapters.add(createChapter(13, "सत्ता की साझेदारी", "jhss401.pdf", "civics", "राजनीति विज्ञान", "लोकतांत्रिक राजनीति - II", List.of(
                createTopic("13.1", "बेल्जियम और श्रीलंका की केस स्टडी"),
                createTopic("13.2", "सत्ता की साझेदारी क्यों ज़रूरी है?"),
                createTopic("13.3", "सत्ता की साझेदारी के रूप")
        )));
        chapters.add(createChapter(14, "संघवाद", "jhss402.pdf", "civics", "राजनीति विज्ञान", "लोकतांत्रिक राजनीति - II", List.of(
                createTopic("14.1", "संघवाद क्या है? प्रमुख विशेषताएँ"),
                createTopic("14.2", "भारत में संघीय व्यवस्था (तीन सूचियाँ)"),
                createTopic("14.3", "संघीय व्यवस्था कैसे चलती है? भाषाई राज्य"),
                createTopic("14.4", "भारत में विकेंद्रीकरण (पंचायती राज)")
        )));
        chapters.add(createChapter(15, "लोकतंत्र और विविधता", "jhss403.pdf", "civics", "राजनीति विज्ञान", "लोकतांत्रिक राजनीति - II", List.of(
                createTopic("15.1", "मेक्सिको ओलंपिक की कहानी"),
                createTopic("15.2", "समानताएँ, अंतर और विभाजन"),
                createTopic("15.3", "सामाजिक विभाजनों की राजनीति")
        )));
        chapters.add(createChapter(16, "जाति, धर्म और लैंगिक मसले", "jhss404.pdf", "civics", "राजनीति विज्ञान", "लोकतांत्रिक राजनीति - II", List.of(
                createTopic("16.1", "लैंगिक मसले और राजनीति"),
                createTopic("16.2", "धर्म, सांप्रदायिकता और राजनीति"),
                createTopic("16.3", "जाति और राजनीति")
        )));
        chapters.add(createChapter(17, "जन-संघर्ष और आंदोलन", "jhss405.pdf", "civics", "राजनीति विज्ञान", "लोकतांत्रिक राजनीति - II", List.of(
                createTopic("17.1", "नेपाल और बोलीविया में जनसंघर्ष"),
                createTopic("17.2", "दबाव समूह और आंदोलन")
        )));
        chapters.add(createChapter(18, "राजनीतिक दल", "jhss406.pdf", "civics", "राजनीति विज्ञान", "लोकतांत्रिक राजनीति - II", List.of(
                createTopic("18.1", "राजनीतिक दलों की ज़रूरत क्यों है?"),
                createTopic("18.2", "कितने राजनीतिक दल होने चाहिए?"),
                createTopic("18.3", "राष्ट्रीय एवं प्रांतीय दल"),
                createTopic("18.4", "राजनीतिक दलों के लिए चुनौतियाँ व सुधार")
        )));
        chapters.add(createChapter(19, "लोकतंत्र के परिणाम", "jhss407.pdf", "civics", "राजनीति विज्ञान", "लोकतांत्रिक राजनीति - II", List.of(
                createTopic("19.1", "लोकतंत्र के परिणामों का मूल्यांकन"),
                createTopic("19.2", "उत्तरदायी, ज़िम्मेवार और वैध शासन"),
                createTopic("19.3", "आर्थिक संवृद्धि और असमानता में कमी"),
                createTopic("19.4", "सामाजिक विविधता में सामंजस्य")
        )));
        chapters.add(createChapter(20, "लोकतंत्र की चुनौतियाँ", "jhss408.pdf", "civics", "राजनीति विज्ञान", "लोकतांत्रिक राजनीति - II", List.of(
                createTopic("20.1", "बुनियादी चुनौतियाँ"),
                createTopic("20.2", "लोकतंत्र का विस्तार एवं गहरीकरण"),
                createTopic("20.3", "राजनीतिक सुधार")
        )));

        // Unit 4: अर्थशास्त्र (आर्थिक विकास की समझ)
        chapters.add(createChapter(21, "विकास", "jhss201.pdf", "economics", "अर्थशास्त्र", "आर्थिक विकास की समझ", List.of(
                createTopic("21.1", "विकास क्या वादा करता है — विभिन्न व्यक्ति, विभिन्न लक्ष्य"),
                createTopic("21.2", "आय और अन्य लक्ष्य & राष्ट्रीय विकास"),
                createTopic("21.3", "विभिन्न देशों या राज्यों की तुलना कैसे की जाए?"),
                createTopic("21.4", "विकास की धारणीयता")
        )));
        chapters.add(createChapter(22, "भारतीय अर्थव्यवस्था के क्षेत्रक", "jhss202.pdf", "economics", "अर्थशास्त्र", "आर्थिक विकास की समझ", List.of(
                createTopic("22.1", "प्राथमिक, द्वितीयक और तृतीयक क्षेत्रक"),
                createTopic("22.2", "तीनों क्षेत्रकों की तुलना एवं ऐतिहासिक परिवर्तन"),
                createTopic("22.3", "अधिकांश लोग कहाँ नियोजित हैं?"),
                createTopic("22.4", "संगठित और असंगठित क्षेत्रक")
        )));
        chapters.add(createChapter(23, "मुद्रा और साख", "jhss203.pdf", "economics", "अर्थशास्त्र", "आर्थिक विकास की समझ", List.of(
                createTopic("23.1", "विनिमय का माध्यम: मुद्रा"),
                createTopic("23.2", "बैंकों की ऋण संबंधी गतिविधियाँ"),
                createTopic("23.3", "साख की शर्तें"),
                createTopic("23.4", "भारत में औपचारिक क्षेत्रक में साख & स्वयं सहायता समूह")
        )));
        chapters.add(createChapter(24, "वैश्वीकरण और भारतीय अर्थव्यवस्था", "jhss204.pdf", "economics", "अर्थशास्त्र", "आर्थिक विकास की समझ", List.of(
                createTopic("24.1", "अंतर्देशीय उत्पादन एवं बहुराष्ट्रीय कंपनियाँ (MNCs)"),
                createTopic("24.2", "विदेश व्यापार और बाज़ारों का एकीकरण"),
                createTopic("24.3", "वैश्वीकरण क्या है? इसे संभव बनाने वाले कारक"),
                createTopic("24.4", "भारत में वैश्वीकरण का प्रभाव")
        )));
        chapters.add(createChapter(25, "उपभोक्ता अधिकार", "jhss205.pdf", "economics", "अर्थशास्त्र", "आर्थिक विकास की समझ", List.of(
                createTopic("25.1", "बाज़ार में उपभोक्ता"),
                createTopic("25.2", "उपभोक्ता आंदोलन एवं COPRA 1986"),
                createTopic("25.3", "सुरक्षा सबका अधिकार & उपभोक्ता अधिकार"),
                createTopic("25.4", "उपभोक्ता आंदोलन को आगे बढ़ाने की दिशा")
        )));

        data.put("chapters", chapters);
        return data;
    }

    private Map<String, Object> createCategory(String id, String name, String bookTitle, String description, int count) {
        Map<String, Object> cat = new LinkedHashMap<>();
        cat.put("id", id);
        cat.put("name", name);
        cat.put("bookTitle", bookTitle);
        cat.put("description", description);
        cat.put("count", count);
        return cat;
    }

    private Map<String, Object> createChapter(int id, String title, String fileName, 
                                              String categoryId, String categoryName, String bookTitle, 
                                              List<Map<String, Object>> topics) {
        return createChapter(id, String.format("Chapter %d", id), title, fileName, null, null, categoryId, categoryName, bookTitle, topics);
    }

    private Map<String, Object> createChapter(int id, String number, String title, String fileName, 
                                              String categoryId, String categoryName, String bookTitle, 
                                              List<Map<String, Object>> topics) {
        return createChapter(id, number, title, fileName, null, null, categoryId, categoryName, bookTitle, topics);
    }

    private Map<String, Object> createChapter(int id, String title, String fileName,
                                              String hindiFileName, String hindiTitle,
                                              String categoryId, String categoryName, String bookTitle, 
                                              List<Map<String, Object>> topics) {
        return createChapter(id, String.format("Chapter %d", id), title, fileName, hindiFileName, hindiTitle, categoryId, categoryName, bookTitle, topics);
    }

    private Map<String, Object> createChapter(int id, String number, String title, String fileName,
                                              String hindiFileName, String hindiTitle,
                                              String categoryId, String categoryName, String bookTitle, 
                                              List<Map<String, Object>> topics) {
        Map<String, Object> ch = new LinkedHashMap<>();
        ch.put("id", id);
        ch.put("number", number != null ? number : String.format("Chapter %d", id));
        ch.put("title", title);
        ch.put("fileName", fileName);
        if (hindiFileName != null) {
            ch.put("hindiFileName", hindiFileName);
        }
        if (hindiTitle != null) {
            ch.put("hindiTitle", hindiTitle);
        }
        ch.put("category", categoryId);
        ch.put("categoryName", categoryName);
        ch.put("bookTitle", bookTitle);
        ch.put("topics", topics != null ? topics : Collections.emptyList());
        return ch;
    }

    private Map<String, Object> createTopic(String number, String title) {
        Map<String, Object> topic = new LinkedHashMap<>();
        topic.put("number", number);
        topic.put("title", title);
        return topic;
    }
}

package com.rivaanshprep.controller;

import java.util.*;

public class Class11And12Catalog {

    public static Map<String, Object> createCategory(String id, String name, String bookTitle, String description, int count) {
        Map<String, Object> cat = new LinkedHashMap<>();
        cat.put("id", id);
        cat.put("name", name);
        cat.put("bookTitle", bookTitle);
        cat.put("description", description);
        cat.put("count", count);
        return cat;
    }

    public static Map<String, Object> createChapter(int id, String number, String title, String fileName,
                                                    String hindiFileName, String hindiTitle,
                                                    String categoryId, String categoryName, String bookTitle,
                                                    List<Map<String, Object>> topics) {
        Map<String, Object> ch = new LinkedHashMap<>();
        ch.put("id", id);
        ch.put("number", number);
        ch.put("title", title);
        ch.put("fileName", fileName);
        ch.put("hindiFileName", hindiFileName);
        ch.put("hindiTitle", hindiTitle);
        ch.put("category", categoryId);
        ch.put("categoryName", categoryName);
        ch.put("bookTitle", bookTitle);
        ch.put("topics", topics != null ? topics : Collections.emptyList());
        return ch;
    }

    public static Map<String, Object> createTopic(String number, String title) {
        Map<String, Object> topic = new LinkedHashMap<>();
        topic.put("number", number);
        topic.put("title", title);
        return topic;
    }

    // =========================================================================
    // CLASS 11: PHYSICS
    // =========================================================================
    public static Map<String, Object> getClass11PhysicsToc(boolean isHindi) {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("subjectId", "physics-11");
        data.put("title", isHindi ? "भौतिक विज्ञान कक्षा 11 (NCERT Physics)" : "PHYSICS Textbook for Class XI");
        data.put("board", "NCERT / CBSE Class 11");
        data.put("code", "Code 042");

        List<Map<String, Object>> categories = List.of(
                createCategory("part1", "Part 1 — Mechanics", "NCERT Physics Part I", "Units, Motion, Work Energy & Gravitation", 7),
                createCategory("part2", "Part 2 — Thermal & Waves", "NCERT Physics Part II", "Properties of Matter, Thermodynamics, Oscillations & Waves", 7)
        );
        data.put("categories", categories);

        List<Map<String, Object>> chapters = new ArrayList<>();
        chapters.add(createChapter(1, "Chapter 1", "Units and Measurements", "keph101.pdf", "khph101.pdf", "मात्रक और मापन", "part1", "Part 1 — Mechanics", "NCERT Physics Part I", List.of(
                createTopic("1.1", "The International System of Units (SI)"),
                createTopic("1.2", "Significant Figures & Error Analysis"),
                createTopic("1.3", "Dimensions of Physical Quantities & Dimensional Analysis")
        )));
        chapters.add(createChapter(2, "Chapter 2", "Motion in a Straight Line", "keph102.pdf", "khph102.pdf", "सरल रेखा में गति", "part1", "Part 1 — Mechanics", "NCERT Physics Part I", List.of(
                createTopic("2.1", "Instantaneous Velocity and Speed"),
                createTopic("2.2", "Kinematic Equations for Uniformly Accelerated Motion"),
                createTopic("2.3", "Relative Velocity")
        )));
        chapters.add(createChapter(3, "Chapter 3", "Motion in a Plane", "keph103.pdf", "khph103.pdf", "समतल में गति", "part1", "Part 1 — Mechanics", "NCERT Physics Part I", List.of(
                createTopic("3.1", "Scalars and Vectors"),
                createTopic("3.2", "Resolution of Vectors & Vector Operations"),
                createTopic("3.3", "Projectile Motion"),
                createTopic("3.4", "Uniform Circular Motion")
        )));
        chapters.add(createChapter(4, "Chapter 4", "Laws of Motion", "keph104.pdf", "khph104.pdf", "गति के नियम", "part1", "Part 1 — Mechanics", "NCERT Physics Part I", List.of(
                createTopic("4.1", "Newton's First, Second and Third Laws"),
                createTopic("4.2", "Conservation of Momentum & Friction"),
                createTopic("4.3", "Circular Motion & Free Body Diagrams")
        )));
        chapters.add(createChapter(5, "Chapter 5", "Work, Energy and Power", "keph105.pdf", "khph105.pdf", "कार्य, ऊर्जा और शक्ति", "part1", "Part 1 — Mechanics", "NCERT Physics Part I", List.of(
                createTopic("5.1", "Work-Energy Theorem"),
                createTopic("5.2", "Conservative and Non-conservative Forces"),
                createTopic("5.3", "Collisions in One and Two Dimensions")
        )));
        chapters.add(createChapter(6, "Chapter 6", "System of Particles and Rotational Motion", "keph106.pdf", "khph106.pdf", "कणों के निकाय तथा घूर्णी गति", "part1", "Part 1 — Mechanics", "NCERT Physics Part I", List.of(
                createTopic("6.1", "Centre of Mass & Momentum Conservation"),
                createTopic("6.2", "Angular Velocity, Torque & Angular Momentum"),
                createTopic("6.3", "Moment of Inertia & Parallel/Perpendicular Theorems")
        )));
        chapters.add(createChapter(7, "Chapter 7", "Gravitation", "keph107.pdf", "khph107.pdf", "गुरुत्वाकर्षण", "part1", "Part 1 — Mechanics", "NCERT Physics Part I", List.of(
                createTopic("7.1", "Universal Law of Gravitation & Kepler's Laws"),
                createTopic("7.2", "Acceleration due to Gravity above and below Earth"),
                createTopic("7.3", "Gravitational Potential Energy & Escape Velocity"),
                createTopic("7.4", "Earth Satellites & Weightlessness")
        )));
        chapters.add(createChapter(8, "Chapter 8", "Mechanical Properties of Solids", "keph201.pdf", "khph201.pdf", "ठोसों के यांत्रिक गुण", "part2", "Part 2 — Thermal & Waves", "NCERT Physics Part II", List.of(
                createTopic("8.1", "Stress, Strain & Hooke's Law"),
                createTopic("8.2", "Stress-Strain Curve & Elastic Moduli")
        )));
        chapters.add(createChapter(9, "Chapter 9", "Mechanical Properties of Fluids", "keph202.pdf", "khph202.pdf", "तरलों के यांत्रिक गुण", "part2", "Part 2 — Thermal & Waves", "NCERT Physics Part II", List.of(
                createTopic("9.1", "Pascal's Law & Hydraulic Machines"),
                createTopic("9.2", "Streamline Flow & Bernoulli's Principle"),
                createTopic("9.3", "Viscosity, Reynolds Number & Surface Tension")
        )));
        chapters.add(createChapter(10, "Chapter 10", "Thermal Properties of Matter", "keph203.pdf", "khph203.pdf", "द्रव्य के तापीय गुण", "part2", "Part 2 — Thermal & Waves", "NCERT Physics Part II", List.of(
                createTopic("10.1", "Thermal Expansion & Specific Heat"),
                createTopic("10.2", "Calorimetry & Change of State"),
                createTopic("10.3", "Heat Transfer & Newton's Law of Cooling")
        )));
        chapters.add(createChapter(11, "Chapter 11", "Thermodynamics", "keph204.pdf", "khph204.pdf", "ऊष्मागतिकी", "part2", "Part 2 — Thermal & Waves", "NCERT Physics Part II", List.of(
                createTopic("11.1", "Zeroth & First Law of Thermodynamics"),
                createTopic("11.2", "Isothermal, Adiabatic & Isochoric Processes"),
                createTopic("11.3", "Second Law & Carnot Heat Engines")
        )));
        chapters.add(createChapter(12, "Chapter 12", "Kinetic Theory of Gases", "keph205.pdf", "khph205.pdf", "अणुगति सिद्धान्त", "part2", "Part 2 — Thermal & Waves", "NCERT Physics Part II", List.of(
                createTopic("12.1", "Ideal Gas Equation & Kinetic Pressure"),
                createTopic("12.2", "Law of Equipartition of Energy & Degrees of Freedom")
        )));
        chapters.add(createChapter(13, "Chapter 13", "Oscillations", "keph206.pdf", "khph206.pdf", "दोलन", "part2", "Part 2 — Thermal & Waves", "NCERT Physics Part II", List.of(
                createTopic("13.1", "Simple Harmonic Motion (SHM)"),
                createTopic("13.2", "Energy in SHM & Simple Pendulum")
        )));
        chapters.add(createChapter(14, "Chapter 14", "Waves", "keph207.pdf", "khph207.pdf", "तरंगें", "part2", "Part 2 — Thermal & Waves", "NCERT Physics Part II", List.of(
                createTopic("14.1", "Transverse and Longitudinal Waves"),
                createTopic("14.2", "Superposition Principle & Standing Waves in Pipes/Strings"),
                createTopic("14.3", "Beats & Doppler Effect")
        )));

        data.put("chapters", chapters);
        return data;
    }

    // =========================================================================
    // CLASS 11: CHEMISTRY
    // =========================================================================
    public static Map<String, Object> getClass11ChemistryToc(boolean isHindi) {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("subjectId", "chemistry-11");
        data.put("title", isHindi ? "रसायन विज्ञान कक्षा 11 (NCERT Chemistry)" : "CHEMISTRY Textbook for Class XI");
        data.put("board", "NCERT / CBSE Class 11");
        data.put("code", "Code 043");

        List<Map<String, Object>> categories = List.of(
                createCategory("part1", "Part 1 — Physical & Inorganic", "NCERT Chemistry Part I", "Atomic Structure, Bonding, Thermodynamics & Equilibrium", 6),
                createCategory("part2", "Part 2 — Organic Chemistry", "NCERT Chemistry Part II", "Redox Reactions, Basic Principles & Hydrocarbons", 3)
        );
        data.put("categories", categories);

        List<Map<String, Object>> chapters = new ArrayList<>();
        chapters.add(createChapter(1, "Chapter 1", "Some Basic Concepts of Chemistry", "kech101.pdf", "khch101.pdf", "रसायन विज्ञान की कुछ मूल अवधारणाएँ", "part1", "Part 1 — Physical & Inorganic", "NCERT Chemistry Part I", List.of(
                createTopic("1.1", "Importance of Chemistry & Matter Classification"),
                createTopic("1.2", "Atomic and Molecular Masses, Mole Concept"),
                createTopic("1.3", "Stoichiometry and Stoichiometric Calculations")
        )));
        chapters.add(createChapter(2, "Chapter 2", "Structure of Atom", "kech102.pdf", "khch102.pdf", "परमाणु की संरचना", "part1", "Part 1 — Physical & Inorganic", "NCERT Chemistry Part I", List.of(
                createTopic("2.1", "Sub-atomic Particles & Bohr's Model"),
                createTopic("2.2", "Quantum Mechanical Model of Atom"),
                createTopic("2.3", "Aufbau Principle, Pauli Exclusion & Hund's Rule")
        )));
        chapters.add(createChapter(3, "Chapter 3", "Classification of Elements & Periodicity", "kech103.pdf", "khch103.pdf", "तत्वों का वर्गीकरण एवं गुणधर्मों में आवर्तिता", "part1", "Part 1 — Physical & Inorganic", "NCERT Chemistry Part I", List.of(
                createTopic("3.1", "Modern Periodic Law and Long Form of Periodic Table"),
                createTopic("3.2", "Periodic Trends in Properties of Elements")
        )));
        chapters.add(createChapter(4, "Chapter 4", "Chemical Bonding and Molecular Structure", "kech104.pdf", "khch104.pdf", "रासायनिक आबंधन तथा आण्विक संरचना", "part1", "Part 1 — Physical & Inorganic", "NCERT Chemistry Part I", List.of(
                createTopic("4.1", "Kössel-Lewis Approach & Ionic/Covalent Bonds"),
                createTopic("4.2", "VSEPR Theory & Valence Bond Theory"),
                createTopic("4.3", "Hybridisation & Molecular Orbital Theory (MOT)")
        )));
        chapters.add(createChapter(5, "Chapter 5", "Chemical Thermodynamics", "kech105.pdf", "khch105.pdf", "ऊष्मागतिकी", "part1", "Part 1 — Physical & Inorganic", "NCERT Chemistry Part I", List.of(
                createTopic("5.1", "Internal Energy, Work, Heat & First Law"),
                createTopic("5.2", "Enthalpy, Hess's Law & Enthalpies of Reactions"),
                createTopic("5.3", "Spontaneity, Entropy & Gibbs Free Energy")
        )));
        chapters.add(createChapter(6, "Chapter 6", "Equilibrium", "kech106.pdf", "khch106.pdf", "साम्यावस्था", "part1", "Part 1 — Physical & Inorganic", "NCERT Chemistry Part I", List.of(
                createTopic("6.1", "Equilibrium in Chemical Processes & Le Chatelier's Principle"),
                createTopic("6.2", "Ionic Equilibrium, Acids, Bases & pH Scale"),
                createTopic("6.3", "Buffer Solutions & Solubility Product")
        )));
        chapters.add(createChapter(7, "Chapter 7", "Redox Reactions", "kech201.pdf", "khch201.pdf", "अपचयोपचय अभिक्रियाएँ", "part2", "Part 2 — Organic Chemistry", "NCERT Chemistry Part II", List.of(
                createTopic("7.1", "Oxidation Number & Balancing Redox Equations"),
                createTopic("7.2", "Redox Reactions as the Basis for Electrochemical Cells")
        )));
        chapters.add(createChapter(8, "Chapter 8", "Organic Chemistry: Some Basic Principles & Techniques", "kech202.pdf", "khch202.pdf", "कार्बनिक रसायन: कुछ आधारभूत सिद्धांत तथा तकनीकें", "part2", "Part 2 — Organic Chemistry", "NCERT Chemistry Part II", List.of(
                createTopic("8.1", "IUPAC Nomenclature of Organic Compounds"),
                createTopic("8.2", "Isomerism: Structural & Stereoisomerism"),
                createTopic("8.3", "Fundamental Concepts in Organic Reaction Mechanisms")
        )));
        chapters.add(createChapter(9, "Chapter 9", "Hydrocarbons", "kech203.pdf", "khch203.pdf", "हाइड्रोकार्बन", "part2", "Part 2 — Organic Chemistry", "NCERT Chemistry Part II", List.of(
                createTopic("9.1", "Alkanes: Preparation, Properties & Conformations"),
                createTopic("9.2", "Alkenes & Alkynes: Preparation & Markovnikov's Rule"),
                createTopic("9.3", "Aromatic Hydrocarbons: Benzene & Electrophilic Substitution")
        )));

        data.put("chapters", chapters);
        return data;
    }

    // =========================================================================
    // CLASS 11: MATHEMATICS
    // =========================================================================
    public static Map<String, Object> getClass11MathToc(boolean isHindi) {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("subjectId", "math-11");
        data.put("title", isHindi ? "गणित कक्षा 11 (NCERT Mathematics)" : "MATHEMATICS Textbook for Class XI");
        data.put("board", "NCERT / CBSE Class 11");
        data.put("code", "Code 041");

        List<Map<String, Object>> categories = List.of(
                createCategory("algebra", "Sets, Relations & Algebra", "NCERT Mathematics Class 11", "Sets, Trigonometry, Complex Numbers & Binomial Theorem", 7),
                createCategory("geometry_calculus", "Coordinate Geometry & Calculus", "NCERT Mathematics Class 11", "Straight Lines, Conic Sections, 3D & Limits", 7)
        );
        data.put("categories", categories);

        List<Map<String, Object>> chapters = new ArrayList<>();
        chapters.add(createChapter(1, "Chapter 1", "Sets", "kemh101.pdf", "khmh101.pdf", "समुच्चय", "algebra", "Sets, Relations & Algebra", "NCERT Mathematics Class 11", List.of(
                createTopic("1.1", "Sets and their Representations"),
                createTopic("1.2", "Subsets, Power Set & Universal Set"),
                createTopic("1.3", "Venn Diagrams & Operations on Sets")
        )));
        chapters.add(createChapter(2, "Chapter 2", "Relations and Functions", "kemh102.pdf", "khmh102.pdf", "संबंध एवं फलन", "algebra", "Sets, Relations & Algebra", "NCERT Mathematics Class 11", List.of(
                createTopic("2.1", "Cartesian Products of Sets"),
                createTopic("2.2", "Relations and Functions"),
                createTopic("2.3", "Domain, Co-domain and Range of Functions")
        )));
        chapters.add(createChapter(3, "Chapter 3", "Trigonometric Functions", "kemh103.pdf", "khmh103.pdf", "त्रिकोणमितीय फलन", "algebra", "Sets, Relations & Algebra", "NCERT Mathematics Class 11", List.of(
                createTopic("3.1", "Angles & Radian Measure"),
                createTopic("3.2", "Trigonometric Functions of Sum and Difference of Angles")
        )));
        chapters.add(createChapter(4, "Chapter 4", "Complex Numbers and Quadratic Equations", "kemh104.pdf", "khmh104.pdf", "सम्मिश्र संख्याएँ और द्विघातीय समीकरण", "algebra", "Sets, Relations & Algebra", "NCERT Mathematics Class 11", List.of(
                createTopic("4.1", "Algebra of Complex Numbers"),
                createTopic("4.2", "Modulus and Conjugate of a Complex Number")
        )));
        chapters.add(createChapter(5, "Chapter 5", "Linear Inequalities", "kemh105.pdf", "khmh105.pdf", "रैखिक असमिकाएँ", "algebra", "Sets, Relations & Algebra", "NCERT Mathematics Class 11", List.of(
                createTopic("5.1", "Algebraic Solutions of Linear Inequalities in One Variable")
        )));
        chapters.add(createChapter(6, "Chapter 6", "Permutations and Combinations", "kemh106.pdf", "khmh106.pdf", "क्रमचय और संचय", "algebra", "Sets, Relations & Algebra", "NCERT Mathematics Class 11", List.of(
                createTopic("6.1", "Fundamental Principle of Counting"),
                createTopic("6.2", "Permutations & Combinations Theorems")
        )));
        chapters.add(createChapter(7, "Chapter 7", "Binomial Theorem", "kemh107.pdf", "khmh107.pdf", "द्विपद प्रमेय", "algebra", "Sets, Relations & Algebra", "NCERT Mathematics Class 11", List.of(
                createTopic("7.1", "Binomial Theorem for Positive Integral Indices")
        )));
        chapters.add(createChapter(8, "Chapter 8", "Sequences and Series", "kemh108.pdf", "khmh108.pdf", "अनुक्रम तथा श्रेणी", "geometry_calculus", "Coordinate Geometry & Calculus", "NCERT Mathematics Class 11", List.of(
                createTopic("8.1", "Geometric Progression (GP) & Sum of n Terms")
        )));
        chapters.add(createChapter(9, "Chapter 9", "Straight Lines", "kemh109.pdf", "khmh109.pdf", "सरल रेखाएँ", "geometry_calculus", "Coordinate Geometry & Calculus", "NCERT Mathematics Class 11", List.of(
                createTopic("9.1", "Slope of a Line & Various Forms of Equation of a Line")
        )));
        chapters.add(createChapter(10, "Chapter 10", "Conic Sections", "kemh110.pdf", "khmh110.pdf", "शंकु परिच्छेद", "geometry_calculus", "Coordinate Geometry & Calculus", "NCERT Mathematics Class 11", List.of(
                createTopic("10.1", "Circle, Parabola, Ellipse & Hyperbola Equations")
        )));
        chapters.add(createChapter(11, "Chapter 11", "Introduction to Three Dimensional Geometry", "kemh111.pdf", "khmh111.pdf", "त्रिविमीय ज्यामिति का परिचय", "geometry_calculus", "Coordinate Geometry & Calculus", "NCERT Mathematics Class 11", List.of(
                createTopic("11.1", "Coordinate Axes & Distance Between Two Points in 3D")
        )));
        chapters.add(createChapter(12, "Chapter 12", "Limits and Derivatives", "kemh112.pdf", "khmh112.pdf", "सीमा और अवकलज", "geometry_calculus", "Coordinate Geometry & Calculus", "NCERT Mathematics Class 11", List.of(
                createTopic("12.1", "Intuitive Idea of Limits & Trigonometric Limits"),
                createTopic("12.2", "Derivatives of Polynomials and Trigonometric Functions")
        )));
        chapters.add(createChapter(13, "Chapter 13", "Statistics", "kemh113.pdf", "khmh113.pdf", "सांख्यिकी", "geometry_calculus", "Coordinate Geometry & Calculus", "NCERT Mathematics Class 11", List.of(
                createTopic("13.1", "Measures of Dispersion: Mean Deviation & Standard Deviation")
        )));
        chapters.add(createChapter(14, "Chapter 14", "Probability", "kemh114.pdf", "khmh114.pdf", "प्रायिकता", "geometry_calculus", "Coordinate Geometry & Calculus", "NCERT Mathematics Class 11", List.of(
                createTopic("14.1", "Events, Axiomatic Approach to Probability")
        )));

        data.put("chapters", chapters);
        return data;
    }

    // =========================================================================
    // CLASS 12: PHYSICS
    // =========================================================================
    public static Map<String, Object> getClass12PhysicsToc(boolean isHindi) {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("subjectId", "physics-12");
        data.put("title", isHindi ? "भौतिक विज्ञान कक्षा 12 (NCERT Physics)" : "PHYSICS Textbook for Class XII");
        data.put("board", "NCERT / CBSE Class 12");
        data.put("code", "Code 042");

        List<Map<String, Object>> categories = List.of(
                createCategory("part1", "Part 1 — Electromagnetism", "NCERT Physics Part I", "Electrostatics, Magnetism, Induction & AC", 8),
                createCategory("part2", "Part 2 — Optics & Modern Physics", "NCERT Physics Part II", "Optics, Atoms, Nuclei & Semiconductor Electronics", 6)
        );
        data.put("categories", categories);

        List<Map<String, Object>> chapters = new ArrayList<>();
        chapters.add(createChapter(1, "Chapter 1", "Electric Charges and Fields", "leph101.pdf", "lhph101.pdf", "वैद्युत आवेश तथा क्षेत्र", "part1", "Part 1 — Electromagnetism", "NCERT Physics Part I", List.of(
                createTopic("1.1", "Coulomb's Law, Electric Field & Field Lines"),
                createTopic("1.2", "Electric Dipole & Gauss's Law with Applications")
        )));
        chapters.add(createChapter(2, "Chapter 2", "Electrostatic Potential and Capacitance", "leph102.pdf", "lhph102.pdf", "स्थिरवैद्युत विभव तथा धारिता", "part1", "Part 1 — Electromagnetism", "NCERT Physics Part I", List.of(
                createTopic("2.1", "Electric Potential & Equipotential Surfaces"),
                createTopic("2.2", "Capacitors and Capacitance, Dielectrics & Energy Stored")
        )));
        chapters.add(createChapter(3, "Chapter 3", "Current Electricity", "leph103.pdf", "lhph103.pdf", "विद्युत धारा", "part1", "Part 1 — Electromagnetism", "NCERT Physics Part I", List.of(
                createTopic("3.1", "Ohm's Law, Drift Velocity & Resistivity"),
                createTopic("3.2", "Kirchhoff's Rules and Wheatstone Bridge")
        )));
        chapters.add(createChapter(4, "Chapter 4", "Moving Charges and Magnetism", "leph104.pdf", "lhph104.pdf", "गतिमान आवेश और चुंबकत्व", "part1", "Part 1 — Electromagnetism", "NCERT Physics Part I", List.of(
                createTopic("4.1", "Biot-Savart Law & Ampere's Circuital Law"),
                createTopic("4.2", "Force on Current-Carrying Conductor & Moving Coil Galvanometer")
        )));
        chapters.add(createChapter(5, "Chapter 5", "Magnetism and Matter", "leph105.pdf", "lhph105.pdf", "चुंबकत्व एवं द्रव्य", "part1", "Part 1 — Electromagnetism", "NCERT Physics Part I", List.of(
                createTopic("5.1", "Bar Magnet as Equivalent Solenoid & Earth's Magnetism"),
                createTopic("5.2", "Dia, Para and Ferromagnetic Substances")
        )));
        chapters.add(createChapter(6, "Chapter 6", "Electromagnetic Induction", "leph106.pdf", "lhph106.pdf", "वैद्युतचुंबकीय प्रेरण", "part1", "Part 1 — Electromagnetism", "NCERT Physics Part I", List.of(
                createTopic("6.1", "Faraday's & Lenz's Laws of Induction"),
                createTopic("6.2", "Motional EMF, Self and Mutual Inductance")
        )));
        chapters.add(createChapter(7, "Chapter 7", "Alternating Current", "leph107.pdf", "lhph107.pdf", "प्रत्यावर्ती धारा", "part1", "Part 1 — Electromagnetism", "NCERT Physics Part I", List.of(
                createTopic("7.1", "Peak and RMS Values of AC"),
                createTopic("7.2", "LCR Series Circuit, Resonance & Transformers")
        )));
        chapters.add(createChapter(8, "Chapter 8", "Electromagnetic Waves", "leph108.pdf", "lhph108.pdf", "वैद्युतचुंबकीय तरंगें", "part1", "Part 1 — Electromagnetism", "NCERT Physics Part I", List.of(
                createTopic("8.1", "Displacement Current & Maxwell's Equations"),
                createTopic("8.2", "Electromagnetic Spectrum & Applications")
        )));
        chapters.add(createChapter(9, "Chapter 9", "Ray Optics and Optical Instruments", "leph201.pdf", "lhph201.pdf", "किरण प्रकाशिकी एवं प्रकाशिक यंत्र", "part2", "Part 2 — Optics & Modern Physics", "NCERT Physics Part II", List.of(
                createTopic("9.1", "Total Internal Reflection & Refraction at Spherical Surfaces"),
                createTopic("9.2", "Lens Formula & Microscopes/Telescopes")
        )));
        chapters.add(createChapter(10, "Chapter 10", "Wave Optics", "leph202.pdf", "lhph202.pdf", "तरंग-प्रकाशिकी", "part2", "Part 2 — Optics & Modern Physics", "NCERT Physics Part II", List.of(
                createTopic("10.1", "Huygens Principle & Wavefronts"),
                createTopic("10.2", "Young's Double Slit Experiment & Diffraction")
        )));
        chapters.add(createChapter(11, "Chapter 11", "Dual Nature of Radiation and Matter", "leph203.pdf", "lhph203.pdf", "विकिरण तथा द्रव्य की द्वैत प्रकृति", "part2", "Part 2 — Optics & Modern Physics", "NCERT Physics Part II", List.of(
                createTopic("11.1", "Photoelectric Effect & Einstein's Photoelectric Equation"),
                createTopic("11.2", "De Broglie Hypothesis & Wavelength")
        )));
        chapters.add(createChapter(12, "Chapter 12", "Atoms", "leph204.pdf", "lhph204.pdf", "परमाणु", "part2", "Part 2 — Optics & Modern Physics", "NCERT Physics Part II", List.of(
                createTopic("12.1", "Rutherford's Alpha-particle Scattering Experiment"),
                createTopic("12.2", "Bohr Model of the Hydrogen Atom & Spectral Series")
        )));
        chapters.add(createChapter(13, "Chapter 13", "Nuclei", "leph205.pdf", "lhph205.pdf", "नाभिक", "part2", "Part 2 — Optics & Modern Physics", "NCERT Physics Part II", List.of(
                createTopic("13.1", "Nuclear Size, Mass Defect & Binding Energy"),
                createTopic("13.2", "Nuclear Fission and Nuclear Fusion")
        )));
        chapters.add(createChapter(14, "Chapter 14", "Semiconductor Electronics: Materials, Devices and Simple Circuits", "leph206.pdf", "lhph206.pdf", "अर्धचालक इलेक्ट्रॉनिकी: पदार्थ, युक्तियाँ तथा सरल परिपथ", "part2", "Part 2 — Optics & Modern Physics", "NCERT Physics Part II", List.of(
                createTopic("14.1", "Intrinsic and Extrinsic Semiconductors"),
                createTopic("14.2", "p-n Junction Diode, Rectifiers & Special Diodes")
        )));

        data.put("chapters", chapters);
        return data;
    }

    // =========================================================================
    // CLASS 12: CHEMISTRY
    // =========================================================================
    public static Map<String, Object> getClass12ChemistryToc(boolean isHindi) {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("subjectId", "chemistry-12");
        data.put("title", isHindi ? "रसायन विज्ञान कक्षा 12 (NCERT Chemistry)" : "CHEMISTRY Textbook for Class XII");
        data.put("board", "NCERT / CBSE Class 12");
        data.put("code", "Code 043");

        List<Map<String, Object>> categories = List.of(
                createCategory("part1", "Part 1 — Physical & Inorganic", "NCERT Chemistry Part I", "Solutions, Electrochemistry, Kinetics & Coordination Compounds", 5),
                createCategory("part2", "Part 2 — Organic Chemistry", "NCERT Chemistry Part II", "Haloalkanes, Alcohols, Aldehydes, Amines & Biomolecules", 5)
        );
        data.put("categories", categories);

        List<Map<String, Object>> chapters = new ArrayList<>();
        chapters.add(createChapter(1, "Chapter 1", "Solutions", "lech101.pdf", "lhch101.pdf", "विलयन", "part1", "Part 1 — Physical & Inorganic", "NCERT Chemistry Part I", List.of(
                createTopic("1.1", "Types of Solutions & Henry's Law"),
                createTopic("1.2", "Raoult's Law & Colligative Properties"),
                createTopic("1.3", "Abnormal Molar Masses & van 't Hoff Factor")
        )));
        chapters.add(createChapter(2, "Chapter 2", "Electrochemistry", "lech102.pdf", "lhch102.pdf", "विद्युतरसायन", "part1", "Part 1 — Physical & Inorganic", "NCERT Chemistry Part I", List.of(
                createTopic("2.1", "Galvanic Cells & Nernst Equation"),
                createTopic("2.2", "Conductance in Electrolytic Solutions & Kohlrausch Law"),
                createTopic("2.3", "Batteries, Fuel Cells & Corrosion")
        )));
        chapters.add(createChapter(3, "Chapter 3", "Chemical Kinetics", "lech103.pdf", "lhch103.pdf", "रासायनिक बलगतिकी", "part1", "Part 1 — Physical & Inorganic", "NCERT Chemistry Part I", List.of(
                createTopic("3.1", "Rate of Reaction, Order & Molecularity"),
                createTopic("3.2", "Integrated Rate Equations (Zero & First Order)"),
                createTopic("3.3", "Arrhenius Equation & Collision Theory")
        )));
        chapters.add(createChapter(4, "Chapter 4", "The d- and f-Block Elements", "lech104.pdf", "lhch104.pdf", "d- एवं f-ब्लॉक के तत्व", "part1", "Part 1 — Physical & Inorganic", "NCERT Chemistry Part I", List.of(
                createTopic("4.1", "Transition Elements & Electronic Configurations"),
                createTopic("4.2", "Lanthanoids and Actinoids (Lanthanoid Contraction)")
        )));
        chapters.add(createChapter(5, "Chapter 5", "Coordination Compounds", "lech105.pdf", "lhch105.pdf", "उपसहसंयोजन यौगिक", "part1", "Part 1 — Physical & Inorganic", "NCERT Chemistry Part I", List.of(
                createTopic("5.1", "Werner's Theory, Ligands & IUPAC Nomenclature"),
                createTopic("5.2", "Valence Bond Theory & Crystal Field Theory (CFT)")
        )));
        chapters.add(createChapter(6, "Chapter 6", "Haloalkanes and Haloarenes", "lech201.pdf", "lhch201.pdf", "हैलोएल्केन तथा हैलोएरीन", "part2", "Part 2 — Organic Chemistry", "NCERT Chemistry Part II", List.of(
                createTopic("6.1", "SN1 and SN2 Mechanisms"),
                createTopic("6.2", "Reactions of Haloarenes & Polyhalogen Compounds")
        )));
        chapters.add(createChapter(7, "Chapter 7", "Alcohols, Phenols and Ethers", "lech202.pdf", "lhch202.pdf", "ऐल्कोहॉल, फीनॉल एवं ईथर", "part2", "Part 2 — Organic Chemistry", "NCERT Chemistry Part II", List.of(
                createTopic("7.1", "Preparation, Acidic Nature & Reimer-Tiemann Reaction"),
                createTopic("7.2", "Ethers: Williamson Synthesis")
        )));
        chapters.add(createChapter(8, "Chapter 8", "Aldehydes, Ketones and Carboxylic Acids", "lech203.pdf", "lhch203.pdf", "ऐल्डिहाइड, कीटोन एवं कार्बोक्सिलिक अम्ल", "part2", "Part 2 — Organic Chemistry", "NCERT Chemistry Part II", List.of(
                createTopic("8.1", "Nucleophilic Addition Reactions & Cannizzaro Reaction"),
                createTopic("8.2", "Acidity of Carboxylic Acids")
        )));
        chapters.add(createChapter(9, "Chapter 9", "Amines", "lech204.pdf", "lhch204.pdf", "ऐमीन", "part2", "Part 2 — Organic Chemistry", "NCERT Chemistry Part II", List.of(
                createTopic("9.1", "Basicity of Amines & Gabriel Phthalimide Synthesis"),
                createTopic("9.2", "Diazonium Salts & Synthetic Applications")
        )));
        chapters.add(createChapter(10, "Chapter 10", "Biomolecules", "lech205.pdf", "lhch205.pdf", "जैव-अणु", "part2", "Part 2 — Organic Chemistry", "NCERT Chemistry Part II", List.of(
                createTopic("10.1", "Carbohydrates: Glucose, Fructose & Polysaccharides"),
                createTopic("10.2", "Proteins, Amino Acids, Nucleic Acids (DNA & RNA)")
        )));

        data.put("chapters", chapters);
        return data;
    }

    // =========================================================================
    // CLASS 12: MATHEMATICS
    // =========================================================================
    public static Map<String, Object> getClass12MathToc(boolean isHindi) {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("subjectId", "math-12");
        data.put("title", isHindi ? "गणित कक्षा 12 (NCERT Mathematics)" : "MATHEMATICS Textbook for Class XII");
        data.put("board", "NCERT / CBSE Class 12");
        data.put("code", "Code 041");

        List<Map<String, Object>> categories = List.of(
                createCategory("part1", "Part 1 — Relations & Calculus", "NCERT Mathematics Part I", "Relations, Inverse Trig, Matrices, Determinants & Continuity", 6),
                createCategory("part2", "Part 2 — Integrals, Vectors & Probability", "NCERT Mathematics Part II", "Integrals, Differential Equations, 3D Geometry & Probability", 7)
        );
        data.put("categories", categories);

        List<Map<String, Object>> chapters = new ArrayList<>();
        chapters.add(createChapter(1, "Chapter 1", "Relations and Functions", "lemh101.pdf", "lhmh101.pdf", "संबंध एवं फलन", "part1", "Part 1 — Relations & Calculus", "NCERT Mathematics Part I", List.of(
                createTopic("1.1", "Types of Relations (Equivalence Relations)"),
                createTopic("1.2", "One-one and Onto Functions")
        )));
        chapters.add(createChapter(2, "Chapter 2", "Inverse Trigonometric Functions", "lemh102.pdf", "lhmh102.pdf", "प्रतिलोम त्रिकोणमितीय फलन", "part1", "Part 1 — Relations & Calculus", "NCERT Mathematics Part I", List.of(
                createTopic("2.1", "Principal Value Branches of Inverse Trigonometric Functions")
        )));
        chapters.add(createChapter(3, "Chapter 3", "Matrices", "lemh103.pdf", "lhmh103.pdf", "आव्यूह", "part1", "Part 1 — Relations & Calculus", "NCERT Mathematics Part I", List.of(
                createTopic("3.1", "Matrix Multiplication, Transpose & Symmetric Matrices")
        )));
        chapters.add(createChapter(4, "Chapter 4", "Determinants", "lemh104.pdf", "lhmh104.pdf", "सारणिक", "part1", "Part 1 — Relations & Calculus", "NCERT Mathematics Part I", List.of(
                createTopic("4.1", "Adjoint and Inverse of a Matrix & Solving Linear Equations")
        )));
        chapters.add(createChapter(5, "Chapter 5", "Continuity and Differentiability", "lemh105.pdf", "lhmh105.pdf", "सांतत्य तथा अवकलनीयता", "part1", "Part 1 — Relations & Calculus", "NCERT Mathematics Part I", List.of(
                createTopic("5.1", "Chain Rule, Logarithmic & Parametric Differentiation"),
                createTopic("5.2", "Second Order Derivatives")
        )));
        chapters.add(createChapter(6, "Chapter 6", "Application of Derivatives", "lemh106.pdf", "lhmh106.pdf", "अवकलज के अनुप्रयोग", "part1", "Part 1 — Relations & Calculus", "NCERT Mathematics Part I", List.of(
                createTopic("6.1", "Increasing and Decreasing Functions"),
                createTopic("6.2", "Maxima and Minima")
        )));
        chapters.add(createChapter(7, "Chapter 7", "Integrals", "lemh201.pdf", "lhmh201.pdf", "समाकलन", "part2", "Part 2 — Integrals, Vectors & Probability", "NCERT Mathematics Part II", List.of(
                createTopic("7.1", "Integration by Substitution, Partial Fractions & Parts"),
                createTopic("7.2", "Definite Integrals & Fundamental Theorem of Calculus")
        )));
        chapters.add(createChapter(8, "Chapter 8", "Application of Integrals", "lemh202.pdf", "lhmh202.pdf", "समाकलनों के अनुप्रयोग", "part2", "Part 2 — Integrals, Vectors & Probability", "NCERT Mathematics Part II", List.of(
                createTopic("8.1", "Area Under Simple Curves (Circles, Parabolas, Ellipses)")
        )));
        chapters.add(createChapter(9, "Chapter 9", "Differential Equations", "lemh203.pdf", "lhmh203.pdf", "अवकल समीकरण", "part2", "Part 2 — Integrals, Vectors & Probability", "NCERT Mathematics Part II", List.of(
                createTopic("9.1", "General and Particular Solutions & Separation of Variables"),
                createTopic("9.2", "Linear Differential Equations")
        )));
        chapters.add(createChapter(10, "Chapter 10", "Vector Algebra", "lemh204.pdf", "lhmh204.pdf", "सदिश बीजगणित", "part2", "Part 2 — Integrals, Vectors & Probability", "NCERT Mathematics Part II", List.of(
                createTopic("10.1", "Scalar (Dot) and Vector (Cross) Product of Vectors")
        )));
        chapters.add(createChapter(11, "Chapter 11", "Three Dimensional Geometry", "lemh205.pdf", "lhmh205.pdf", "त्रिविमीय ज्यामिति", "part2", "Part 2 — Integrals, Vectors & Probability", "NCERT Mathematics Part II", List.of(
                createTopic("11.1", "Direction Cosines & Direction Ratios of a Line"),
                createTopic("11.2", "Equation of a Line & Shortest Distance Between Two Lines")
        )));
        chapters.add(createChapter(12, "Chapter 12", "Linear Programming", "lemh206.pdf", "lhmh206.pdf", "रैखिक प्रोग्रामन", "part2", "Part 2 — Integrals, Vectors & Probability", "NCERT Mathematics Part II", List.of(
                createTopic("12.1", "Graphical Method of Solving Linear Programming Problems")
        )));
        chapters.add(createChapter(13, "Chapter 13", "Probability", "lemh207.pdf", "lhmh207.pdf", "प्रायिकता", "part2", "Part 2 — Integrals, Vectors & Probability", "NCERT Mathematics Part II", List.of(
                createTopic("13.1", "Conditional Probability & Multiplication Theorem"),
                createTopic("13.2", "Bayes' Theorem & Independent Events")
        )));

        data.put("chapters", chapters);
        return data;
    }
}
